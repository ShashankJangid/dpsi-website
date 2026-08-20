import { z } from "zod";
import crypto from "crypto";
import { createRouter, publicQuery, publicMutation } from "./middleware";
import { getMainModels, getGalleryModels, getTcModels } from "./models/cmsSchemas";
import { getAdminUserModel } from "./models/adminUserSchema";
import { convertImageToWebP } from "./utils/mediaConverter";

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const cmsRouter = createRouter({
  // --- ADMIN AUTH ---
  adminLogin: publicMutation
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const isMasterAdmin =
        input.username.trim().toLowerCase() === "admin" &&
        input.password.trim() === "Admin@dps123";

      try {
        const AdminUser = await getAdminUserModel();
        const salt = "dpsi_cms_salt_2026";
        const hash = crypto.createHash("sha256").update(input.password + salt).digest("hex");

        const safeUsername = escapeRegex(input.username.trim());
        const user = await AdminUser.findOne({
          username: { $regex: new RegExp(`^${safeUsername}$`, "i") },
          passwordHash: hash,
        });

        if (user) {
          await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() }).catch(() => {});
          return {
            success: true,
            user: {
              username: user.username,
              role: user.role,
            },
          };
        }

        if (isMasterAdmin) {
          return {
            success: true,
            user: {
              username: "Admin",
              role: "superadmin",
            },
          };
        }

        return { success: false, error: "Invalid username or password" };
      } catch (dbErr: any) {
        console.warn("MongoDB connection check during auth:", dbErr.message);

        // Fallback for Master Admin login even if Atlas IP Whitelist is momentarily blocked
        if (isMasterAdmin) {
          return {
            success: true,
            user: {
              username: "Admin",
              role: "superadmin",
            },
          };
        }

        return {
          success: false,
          error: "Database connection failed. Please ensure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.",
        };
      }
    }),
  // --- 1. MEDIA CONVERSION & CLOUDINARY UPLOAD ---
  uploadAndTranscode: publicMutation
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        base64Data: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const rawBase64 = input.base64Data.includes(",")
          ? input.base64Data.split(",")[1]
          : input.base64Data;
        const buffer = Buffer.from(rawBase64, "base64");

        const { uploadToCloudinary } = await import("./lib/cloudinary");

        if (input.fileType.startsWith("image/")) {
          // Pre-transcode through Sharp and upload to Cloudinary CDN
          const webpResult = await convertImageToWebP(buffer, 82);
          const cloudRes = await uploadToCloudinary(webpResult.buffer, "dpsi_gallery", "image");

          return {
            success: true,
            originalType: input.fileType,
            convertedType: "image/webp",
            dataUrl: cloudRes.secure_url,
            width: cloudRes.width || webpResult.width,
            height: cloudRes.height || webpResult.height,
            size: cloudRes.bytes || webpResult.size,
          };
        } else if (input.fileType.startsWith("video/")) {
          // Upload video to Cloudinary with auto-WebM transcoding
          const cloudRes = await uploadToCloudinary(buffer, "dpsi_videos", "video");
          return {
            success: true,
            originalType: input.fileType,
            convertedType: "video/webm",
            dataUrl: cloudRes.secure_url,
            size: cloudRes.bytes,
          };
        } else {
          // Raw documents / TC PDFs
          const cloudRes = await uploadToCloudinary(buffer, "dpsi_docs", "raw");
          return {
            success: true,
            originalType: input.fileType,
            convertedType: input.fileType,
            dataUrl: cloudRes.secure_url,
            size: cloudRes.bytes || buffer.length,
          };
        }
      } catch (err: any) {
        console.error("Cloudinary upload error:", err);
        return { success: false, error: err.message || "Failed to process media" };
      }
    }),

  // --- 2. DASHBOARD STATS ---
  dashboardStats: publicQuery.query(async () => {
    const { Page, Activity, Popup, Slider, Attachment, MunRegistration } = await getMainModels();
    const { GalleryImage, VideoGallery } = await getGalleryModels();
    const { TransferCertificate } = await getTcModels();

    const [
      totalPages,
      totalActivities,
      totalPopups,
      totalSliders,
      totalAttachments,
      totalMun,
      totalImages,
      totalVideos,
      totalTc,
    ] = await Promise.all([
      Page.countDocuments({ isDeleted: false }),
      Activity.countDocuments({ isDeleted: false }),
      Popup.countDocuments({ isDeleted: false }),
      Slider.countDocuments({ isDeleted: false }),
      Attachment.countDocuments({ isDeleted: false }),
      MunRegistration.countDocuments({ isDeleted: false }),
      GalleryImage.countDocuments({ isDeleted: false }),
      VideoGallery.countDocuments({ isDeleted: false }),
      TransferCertificate.countDocuments({ isDeleted: false }),
    ]);

    return {
      pages: totalPages,
      activities: totalActivities,
      popups: totalPopups,
      sliders: totalSliders,
      attachments: totalAttachments,
      munRegistrations: totalMun,
      galleryImages: totalImages,
      videos: totalVideos,
      transferCertificates: totalTc,
    };
  }),

  // --- 3. MANAGE PAGES ---
  listPages: publicQuery
    .input(z.object({ showTrash: z.boolean().default(false) }).optional())
    .query(async ({ input }) => {
      const { Page } = await getMainModels();
      return Page.find({ isDeleted: input?.showTrash ?? false }).sort({ createdAt: -1 });
    }),
  getPageBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { Page } = await getMainModels();
      const cleanSlug = input.slug.replace(/^\/+/, "").trim();
      const safeSlug = escapeRegex(cleanSlug);
      const page = await Page.findOne({
        slug: { $regex: new RegExp(`^${safeSlug}$`, "i") },
        isDeleted: false,
      });
      return page || null;
    }),
  createPage: publicMutation
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        category: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Page } = await getMainModels();
      return Page.create(input);
    }),
  updatePage: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isPublished: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Page } = await getMainModels();
      const { id, ...data } = input;
      return Page.findByIdAndUpdate(id, data, { new: true });
    }),
  deletePage: publicMutation
    .input(z.object({ id: z.string(), permanent: z.boolean().default(false) }))
    .mutation(async ({ input }) => {
      const { Page } = await getMainModels();
      if (input.permanent) {
        return Page.findByIdAndDelete(input.id);
      }
      return Page.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 4. MANAGE MENUS ---
  listMenus: publicQuery
    .input(z.object({ location: z.enum(["header", "footer_quick", "footer_resources"]).optional() }).optional())
    .query(async ({ input }) => {
      const { Menu } = await getMainModels();
      const filter: any = { isDeleted: false };
      if (input?.location) {
        filter.location = input.location;
      }
      return Menu.find(filter).sort({ order: 1 });
    }),
  createMenu: publicMutation
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        location: z.enum(["header", "footer_quick", "footer_resources"]).default("header"),
        parent: z.string().optional(),
        order: z.number().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      return Menu.create(input);
    }),
  updateMenu: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        url: z.string().optional(),
        location: z.enum(["header", "footer_quick", "footer_resources"]).optional(),
        parent: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      const { id, ...data } = input;
      return Menu.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteMenu: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      return Menu.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 5. POPUP MANAGEMENT ---
  listPopups: publicQuery.query(async () => {
    const { Popup } = await getMainModels();
    return Popup.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  createPopup: publicMutation
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        badgeText: z.string().optional(),
        buttonText: z.string().optional(),
        showOnLoad: z.boolean().default(true),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Popup } = await getMainModels();
      return Popup.create(input);
    }),
  togglePopup: publicMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Popup } = await getMainModels();
      return Popup.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),
  deletePopup: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Popup } = await getMainModels();
      return Popup.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 6. MARQUEE / FLASH ALERTS ---
  listMarquees: publicQuery.query(async () => {
    const { Marquee } = await getMainModels();
    return Marquee.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  createMarquee: publicMutation
    .input(
      z.object({
        text: z.string(),
        linkUrl: z.string().optional(),
        speed: z.number().default(50),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      return Marquee.create(input);
    }),
  toggleMarquee: publicMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      return Marquee.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),
  deleteMarquee: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      return Marquee.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 7. RECENT ACTIVITIES ---
  listActivities: publicQuery.query(async () => {
    const { Activity } = await getMainModels();
    return Activity.find({ isDeleted: false }).sort({ eventDate: -1 });
  }),
  createActivity: publicMutation
    .input(
      z.object({
        title: z.string(),
        category: z.string().default("General"),
        description: z.string(),
        eventDate: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      return Activity.create({
        ...input,
        eventDate: input.eventDate ? new Date(input.eventDate) : new Date(),
      });
    }),
  deleteActivity: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      return Activity.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 8. SLIDER MANAGEMENT ---
  listSliders: publicQuery.query(async () => {
    const { Slider } = await getMainModels();
    return Slider.find({ isDeleted: false }).sort({ order: 1 });
  }),
  createSlider: publicMutation
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        imageUrl: z.string(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        order: z.number().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Slider } = await getMainModels();
      return Slider.create(input);
    }),
  deleteSlider: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Slider } = await getMainModels();
      return Slider.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 9. ATTACHMENTS & CIRCULARS ---
  listAttachments: publicQuery.query(async () => {
    const { Attachment } = await getMainModels();
    return Attachment.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  createAttachment: publicMutation
    .input(
      z.object({
        title: z.string(),
        category: z.string().default("Circulars"),
        fileUrl: z.string(),
        fileName: z.string(),
        fileType: z.string().default("pdf"),
        fileSize: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Attachment } = await getMainModels();
      return Attachment.create(input);
    }),
  deleteAttachment: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Attachment } = await getMainModels();
      return Attachment.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 10. IMAGE GALLERY (dpsi_gallery DB) ---
  listGalleryCategories: publicQuery.query(async () => {
    const { GalleryCategory } = await getGalleryModels();
    return GalleryCategory.find({ isDeleted: false });
  }),
  createGalleryCategory: publicMutation
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { GalleryCategory } = await getGalleryModels();
      return GalleryCategory.create(input);
    }),
  listGalleryImages: publicQuery
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const { GalleryImage } = await getGalleryModels();
      const filter: any = { isDeleted: false };
      if (input?.category && input.category !== "All") {
        filter.category = input.category;
      }
      return GalleryImage.find(filter).sort({ createdAt: -1 });
    }),
  createGalleryImage: publicMutation
    .input(
      z.object({
        title: z.string(),
        category: z.string().default("Campus"),
        imageUrl: z.string(), // WebP image
        originalUrl: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { GalleryImage } = await getGalleryModels();
      return GalleryImage.create(input);
    }),
  deleteGalleryImage: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { GalleryImage } = await getGalleryModels();
      return GalleryImage.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 11. VIDEO GALLERY (dpsi_gallery DB) ---
  listVideos: publicQuery.query(async () => {
    const { VideoGallery } = await getGalleryModels();
    return VideoGallery.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  createVideo: publicMutation
    .input(
      z.object({
        title: z.string(),
        category: z.string().default("Events"),
        youtubeUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { VideoGallery } = await getGalleryModels();
      return VideoGallery.create(input);
    }),
  deleteVideo: publicMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { VideoGallery } = await getGalleryModels();
      return VideoGallery.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 12. TRANSFER CERTIFICATES (dpsi_tc DB) ---
  listTc: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        showTrash: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ input }) => {
      const { TransferCertificate } = await getTcModels();
      const filter: any = { isDeleted: input?.showTrash ?? false };

      if (input?.search && input.search.trim() !== "") {
        const safeSearch = escapeRegex(input.search.trim());
        const regex = new RegExp(safeSearch, "i");
        filter.$or = [
          { admissionNumber: regex },
          { studentName: regex },
          { fatherName: regex },
        ];
      }

      return TransferCertificate.find(filter).sort({ dateOfIssue: -1 });
    }),
  createTc: publicMutation
    .input(
      z.object({
        admissionNumber: z.string(),
        studentName: z.string(),
        fatherName: z.string(),
        motherName: z.string().optional(),
        classLeaving: z.string(),
        dateOfIssue: z.string(),
        certificatePdfUrl: z.string(),
        status: z.enum(["Issued", "Pending", "Cancelled"]).default("Issued"),
        remarks: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { TransferCertificate } = await getTcModels();
      return TransferCertificate.create({
        ...input,
        dateOfIssue: new Date(input.dateOfIssue),
      });
    }),
  deleteTc: publicMutation
    .input(z.object({ id: z.string(), permanent: z.boolean().default(false) }))
    .mutation(async ({ input }) => {
      const { TransferCertificate } = await getTcModels();
      if (input.permanent) {
        return TransferCertificate.findByIdAndDelete(input.id);
      }
      return TransferCertificate.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 13. MUN REGISTRATIONS ---
  listMunRegistrations: publicQuery.query(async () => {
    const { MunRegistration } = await getMainModels();
    return MunRegistration.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  updateMunStatus: publicMutation
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
        paymentStatus: z.enum(["unpaid", "paid"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { MunRegistration } = await getMainModels();
      const { id, ...data } = input;
      return MunRegistration.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 14. UPDATE SLIDER ---
  updateSlider: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        imageUrl: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Slider } = await getMainModels();
      const { id, ...data } = input;
      return Slider.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 16. UPDATE ACTIVITY ---
  updateActivity: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        eventDate: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      const { id, ...rest } = input;
      const data: any = { ...rest };
      if (rest.eventDate) data.eventDate = new Date(rest.eventDate);
      return Activity.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 17. UPDATE MARQUEE ---
  updateMarquee: publicMutation
    .input(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        linkUrl: z.string().optional(),
        speed: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      const { id, ...data } = input;
      return Marquee.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 18. UPDATE ATTACHMENT ---
  updateAttachment: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
        fileUrl: z.string().optional(),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Attachment } = await getMainModels();
      const { id, ...data } = input;
      return Attachment.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 19. TOGGLE MENU ACTIVE ---
  toggleMenu: publicMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      return Menu.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),

  // --- 20. UPDATE VIDEO ---
  updateVideo: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
        youtubeUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { VideoGallery } = await getGalleryModels();
      const { id, ...data } = input;
      return VideoGallery.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 21. BULK CREATE TC ---
  bulkCreateTc: publicMutation
    .input(
      z.object({
        records: z.array(
          z.object({
            admissionNumber: z.string(),
            studentName: z.string(),
            fatherName: z.string(),
            motherName: z.string().optional().default(""),
            classLeaving: z.string(),
            dateOfIssue: z.string(),
            status: z.enum(["Issued", "Pending", "Cancelled"]).default("Issued"),
            remarks: z.string().optional().default(""),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { TransferCertificate } = await getTcModels();
      const docs = input.records.map((r) => ({
        ...r,
        dateOfIssue: new Date(r.dateOfIssue),
        certificatePdfUrl: "https://dpsindirapuram.com/tc/sample.pdf",
      }));
      const result = await TransferCertificate.insertMany(docs, { ordered: false });
      return { success: true, inserted: result.length };
    }),

  // --- 22. SITE SETTINGS ---
  getSiteSettings: publicQuery.query(async () => {
    const { SiteSettings } = await getMainModels();
    const settings = await SiteSettings.find({}).sort({ group: 1, key: 1 });
    if (!settings || settings.length === 0) {
      // Seed defaults on first fetch
      const defaults = [
        { key: "school_name", value: "Delhi Public School Indirapuram", label: "School Name", group: "general" },
        { key: "school_tagline", value: "Excellence in Education — CBSE Affiliated", label: "Tagline", group: "general" },
        { key: "contact_phone", value: "+91-0120-4660000", label: "Contact Phone", group: "contact" },
        { key: "contact_email", value: "info@dpsindirapuram.com", label: "Contact Email", group: "contact" },
        { key: "contact_address", value: "526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014", label: "Address", group: "contact" },
        { key: "admission_status", value: "Open for 2026-27", label: "Admission Status", group: "admissions" },
        { key: "social_facebook", value: "https://facebook.com/dpsindirapuram", label: "Facebook URL", group: "social" },
        { key: "social_instagram", value: "https://instagram.com/dpsindirapuram", label: "Instagram URL", group: "social" },
        { key: "social_youtube", value: "https://youtube.com/@dpsindirapuram", label: "YouTube URL", group: "social" },
      ];
      await SiteSettings.insertMany(defaults).catch(() => {});
      return SiteSettings.find({}).sort({ group: 1, key: 1 });
    }
    return settings;
  }),
  updateSiteSettings: publicMutation
    .input(
      z.object({
        updates: z.array(z.object({ key: z.string(), value: z.string() })),
      })
    )
    .mutation(async ({ input }) => {
      const { SiteSettings } = await getMainModels();
      await Promise.all(
        input.updates.map((u) =>
          SiteSettings.findOneAndUpdate({ key: u.key }, { value: u.value }, { upsert: true, new: true })
        )
      );
      return { success: true };
    }),

  // --- 23. AI CONFIG ---
  getAiConfig: publicQuery.query(async () => {
    const { AiConfig } = await getMainModels();
    const config = await AiConfig.findOne({}).sort({ updatedAt: -1 });
    return config || null;
  }),
  updateAiConfig: publicMutation
    .input(
      z.object({
        systemPrompt: z.string(),
        modelId: z.string().default("llama-3.3-70b-versatile"),
        temperature: z.number().min(0).max(1).default(0.4),
        maxTokens: z.number().min(100).max(2000).default(700),
      })
    )
    .mutation(async ({ input }) => {
      const { AiConfig } = await getMainModels();
      const existing = await AiConfig.findOne({});
      if (existing) {
        await AiConfig.findByIdAndUpdate(existing._id, input);
      } else {
        await AiConfig.create(input);
      }
      return { success: true };
    }),

  // --- 24. POPUP UPDATE ---
  updatePopup: publicMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        badgeText: z.string().optional(),
        buttonText: z.string().optional(),
        showOnLoad: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Popup } = await getMainModels();
      const { id, ...data } = input;
      return Popup.findByIdAndUpdate(id, data, { new: true });
    }),

  // --- 25. REORDER MENU ---
  reorderMenuItems: publicMutation
    .input(
      z.object({
        items: z.array(z.object({ id: z.string(), order: z.number() })),
      })
    )
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      await Promise.all(
        input.items.map((item) =>
          Menu.findByIdAndUpdate(item.id, { order: item.order })
        )
      );
      return { success: true };
    }),
});
