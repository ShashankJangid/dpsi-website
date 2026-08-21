import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createRouter, publicQuery, publicMutation, adminMutation } from "./middleware";
import { getMainModels, getGalleryModels, getTcModels } from "./models/cmsSchemas";
import { getAdminUserModel } from "./models/adminUserSchema";
import { convertImageToWebP } from "./utils/mediaConverter";

const JWT_SECRET = process.env.JWT_SECRET || "";
const MASTER_ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const MASTER_ADMIN_PASS = process.env.ADMIN_PASSWORD || "";

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Login rate limiter: Max 5 failed attempts per 10 minutes per IP
const loginAttemptsMap = new Map<string, { failedCount: number; lockedUntil: number }>();

function checkLoginRateLimit(ip: string): { allowed: boolean; remainingWaitMs?: number } {
  const now = Date.now();
  const entry = loginAttemptsMap.get(ip);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil > now) {
    return { allowed: false, remainingWaitMs: entry.lockedUntil - now };
  }
  if (entry.lockedUntil <= now && entry.failedCount >= 5) {
    loginAttemptsMap.delete(ip);
    return { allowed: true };
  }
  return { allowed: true };
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const entry = loginAttemptsMap.get(ip) || { failedCount: 0, lockedUntil: 0 };
  entry.failedCount += 1;
  if (entry.failedCount >= 5) {
    entry.lockedUntil = now + 10 * 60 * 1000; // Lock for 10 minutes
  }
  loginAttemptsMap.set(ip, entry);
}

function resetLoginAttempts(ip: string) {
  loginAttemptsMap.delete(ip);
}

export const cmsRouter = createRouter({
  // --- ADMIN AUTH ---
  adminLogin: publicMutation
    .input(
      z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientIp = ctx?.req?.headers?.get("x-forwarded-for") || ctx?.req?.headers?.get("cf-connecting-ip") || "admin-login-ip";
      const rateCheck = checkLoginRateLimit(clientIp);
      if (!rateCheck.allowed) {
        const minsLeft = Math.ceil((rateCheck.remainingWaitMs || 0) / 60000);
        return {
          success: false,
          error: `Too many failed login attempts. Account locked for ${minsLeft} minute(s).`,
        };
      }

      const trimmedUser = input.username.trim().toLowerCase();
      const trimmedPass = input.password.trim();

      // Check master admin from env vars
      const isMasterAdmin =
        MASTER_ADMIN_PASS.length > 0 &&
        trimmedUser === MASTER_ADMIN_USER.toLowerCase() &&
        trimmedPass === MASTER_ADMIN_PASS;

      try {
        const AdminUser = await getAdminUserModel();

        const safeUsername = escapeRegex(input.username.trim());
        const user = await AdminUser.findOne({
          username: { $regex: new RegExp(`^${safeUsername}$`, "i") },
        });

        if (user) {
          // Verify password with bcrypt
          const passwordValid = await bcrypt.compare(trimmedPass, user.passwordHash);
          if (passwordValid) {
            resetLoginAttempts(clientIp);
            await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() }).catch(() => {});
            const token = jwt.sign(
              { id: user._id.toString(), username: user.username, role: user.role },
              JWT_SECRET,
              { expiresIn: "8h" }
            );
            return {
              success: true,
              token,
              user: { username: user.username, role: user.role },
            };
          }
        }

        if (isMasterAdmin) {
          resetLoginAttempts(clientIp);
          const token = jwt.sign(
            { id: "master", username: "Admin", role: "superadmin" as const },
            JWT_SECRET,
            { expiresIn: "8h" }
          );
          return {
            success: true,
            token,
            user: { username: "Admin", role: "superadmin" as const },
          };
        }

        recordLoginFailure(clientIp);
        return { success: false, error: "Invalid username or password" };
      } catch (dbErr: unknown) {
        const errMsg = dbErr instanceof Error ? dbErr.message : "Unknown error";
        console.warn("MongoDB connection check during auth:", errMsg);

        if (isMasterAdmin) {
          resetLoginAttempts(clientIp);
          const token = jwt.sign(
            { id: "master", username: "Admin", role: "superadmin" as const },
            JWT_SECRET,
            { expiresIn: "8h" }
          );
          return {
            success: true,
            token,
            user: { username: "Admin", role: "superadmin" as const },
          };
        }

        recordLoginFailure(clientIp);
        return { success: false, error: "Authentication service unavailable. Please try again." };
      }
    }),
  // --- 1. MEDIA CONVERSION & CLOUDINARY UPLOAD ---
  uploadAndTranscode: adminMutation
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileType: z.string().min(1).max(100),
        base64Data: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Disallow dangerous executable extensions
        const lowerName = input.fileName.toLowerCase();
        const forbiddenExtensions = [".exe", ".sh", ".php", ".phtml", ".js", ".mjs", ".cjs", ".bat", ".cmd", ".vbs", ".scr", ".jar"];
        if (forbiddenExtensions.some((ext) => lowerName.endsWith(ext))) {
          return { success: false, error: "Executable files are not permitted." };
        }

        const rawBase64 = input.base64Data.includes(",")
          ? input.base64Data.split(",")[1]
          : input.base64Data;
        const buffer = Buffer.from(rawBase64, "base64");

        // Enforce max 15MB file size
        if (buffer.length > 15 * 1024 * 1024) {
          return { success: false, error: "File size exceeds 15MB limit." };
        }

        const { uploadToCloudinary } = await import("./lib/cloudinary");

        if (input.fileType.startsWith("image/")) {
          // Pre-transcode through Sharp (validates image structure) and upload to Cloudinary CDN
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
          // Validate PDF magic bytes if declaring application/pdf
          if (input.fileType === "application/pdf" || lowerName.endsWith(".pdf")) {
            const isPdf = buffer.slice(0, 5).toString() === "%PDF-";
            if (!isPdf) {
              return { success: false, error: "Invalid PDF document format." };
            }
          }

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
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to process media";
        console.error("Cloudinary upload error:", errMsg);
        return { success: false, error: errMsg };
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
  createPage: adminMutation
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
  updatePage: adminMutation
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
  deletePage: adminMutation
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
  createMenu: adminMutation
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
      const created = await Menu.create(input);

      // Re-index siblings cleanly
      const targetParent = (created.parent || "").trim();
      const siblings = await Menu.find({
        _id: { $ne: created._id },
        location: created.location,
        isDeleted: false,
        ...(targetParent && targetParent !== "None"
          ? { parent: targetParent }
          : { $or: [{ parent: null }, { parent: "" }, { parent: "None" }] }),
      }).sort({ order: 1, updatedAt: -1 });

      const targetIndex = Math.max(0, Math.min((input.order || 1) - 1, siblings.length));
      siblings.splice(targetIndex, 0, created);

      for (let i = 0; i < siblings.length; i++) {
        await Menu.findByIdAndUpdate(siblings[i]._id, { order: i + 1 });
      }

      return created;
    }),
  updateMenu: adminMutation
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
      const updated = await Menu.findByIdAndUpdate(id, data, { new: true });

      if (updated && data.order !== undefined) {
        const targetParent = (updated.parent || "").trim();
        const siblings = await Menu.find({
          _id: { $ne: updated._id },
          location: updated.location,
          isDeleted: false,
          ...(targetParent && targetParent !== "None"
            ? { parent: targetParent }
            : { $or: [{ parent: null }, { parent: "" }, { parent: "None" }] }),
        }).sort({ order: 1, updatedAt: -1 });

        const targetIndex = Math.max(0, Math.min((data.order || 1) - 1, siblings.length));
        siblings.splice(targetIndex, 0, updated);

        for (let i = 0; i < siblings.length; i++) {
          await Menu.findByIdAndUpdate(siblings[i]._id, { order: i + 1 });
        }
      }

      return updated;
    }),
  deleteMenu: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      const deleted = await Menu.findByIdAndUpdate(input.id, { isDeleted: true }, { new: true });

      // Re-index remaining siblings
      if (deleted) {
        const targetParent = (deleted.parent || "").trim();
        const siblings = await Menu.find({
          _id: { $ne: deleted._id },
          location: deleted.location,
          isDeleted: false,
          ...(targetParent && targetParent !== "None"
            ? { parent: targetParent }
            : { $or: [{ parent: null }, { parent: "" }, { parent: "None" }] }),
        }).sort({ order: 1, updatedAt: -1 });

        for (let i = 0; i < siblings.length; i++) {
          await Menu.findByIdAndUpdate(siblings[i]._id, { order: i + 1 });
        }
      }

      return deleted;
    }),

  // --- 5. POPUP MANAGEMENT ---
  listPopups: publicQuery.query(async () => {
    const { Popup } = await getMainModels();
    return Popup.find({ isDeleted: false }).sort({ createdAt: -1 });
  }),
  createPopup: adminMutation
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
  togglePopup: adminMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Popup } = await getMainModels();
      return Popup.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),
  deletePopup: adminMutation
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
  createMarquee: adminMutation
    .input(
      z.object({
        text: z.string(),
        linkUrl: z.string().optional(),
        speed: z.number().default(50),
        textColor: z.string().default("#10b981"),
        bgColor: z.string().default("#047857"),
        badgeText: z.string().default("Notice"),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      return Marquee.create(input);
    }),
  updateMarquee: adminMutation
    .input(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        linkUrl: z.string().optional(),
        speed: z.number().optional(),
        textColor: z.string().optional(),
        bgColor: z.string().optional(),
        badgeText: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      const { id, ...data } = input;
      return Marquee.findByIdAndUpdate(id, data, { new: true });
    }),
  toggleMarquee: adminMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      return Marquee.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),
  deleteMarquee: adminMutation
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
  createActivity: adminMutation
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
  deleteActivity: adminMutation
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
  createSlider: adminMutation
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        imageUrl: z.string().optional().default(""),
        videoUrl: z.string().optional().default(""),
        mediaType: z.enum(["image", "video"]).default("image"),
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
  updateSlider: adminMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        mediaType: z.enum(["image", "video"]).optional(),
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
  deleteSlider: adminMutation
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
  createAttachment: adminMutation
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
  deleteAttachment: adminMutation
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
  createGalleryCategory: adminMutation
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
  createGalleryImage: adminMutation
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
  deleteGalleryImage: adminMutation
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
  createVideo: adminMutation
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
  deleteVideo: adminMutation
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
  createTc: adminMutation
    .input(
      z.object({
        admissionNumber: z.string(),
        studentName: z.string(),
        fatherName: z.string(),
        motherName: z.string().optional(),
        classLeaving: z.string(),
        dateOfIssue: z.string(),
        certificatePdfUrl: z.string().optional().default("https://dpsindirapuram.com/tc/sample.pdf"),
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
  deleteTc: adminMutation
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
  updateMunStatus: adminMutation
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

  // --- 16. UPDATE ACTIVITY ---
  updateActivity: adminMutation
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


  // --- 18. UPDATE ATTACHMENT ---
  updateAttachment: adminMutation
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
  toggleMenu: adminMutation
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const { Menu } = await getMainModels();
      return Menu.findByIdAndUpdate(input.id, { isActive: input.isActive }, { new: true });
    }),

  // --- 20. UPDATE VIDEO ---
  updateVideo: adminMutation
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
  bulkCreateTc: adminMutation
    .input(
      z.object({
        records: z.array(
          z.object({
            admissionNumber: z.string().min(1).max(50),
            studentName: z.string().min(1).max(100),
            fatherName: z.string().min(1).max(100),
            motherName: z.string().optional().default(""),
            classLeaving: z.string().min(1).max(50),
            dateOfIssue: z.string(),
            status: z.enum(["Issued", "Pending", "Cancelled"]).default("Issued"),
            remarks: z.string().optional().default(""),
          })
        ).min(1, "At least one record is required").max(500, "Maximum 500 records per batch upload allowed"),
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
  updateSiteSettings: adminMutation
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
  updateAiConfig: adminMutation
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
  updatePopup: adminMutation
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
  reorderMenuItems: adminMutation
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

  // --- 26. LEADERSHIP & FACULTY ---
  listLeadership: publicQuery.query(async () => {
    const { Leadership } = await getMainModels();
    return Leadership.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createLeadership: adminMutation
    .input(
      z.object({
        name: z.string().min(2),
        role: z.string().min(2),
        designation: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().default(0),
        category: z.string().default("Management"),
      })
    )
    .mutation(async ({ input }) => {
      const { Leadership } = await getMainModels();
      return Leadership.create(input);
    }),
  updateLeadership: adminMutation
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).optional(),
        role: z.string().min(2).optional(),
        designation: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Leadership } = await getMainModels();
      return Leadership.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteLeadership: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Leadership } = await getMainModels();
      return Leadership.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 28. FACILITIES ---
  listFacilities: publicQuery.query(async () => {
    const { Facility } = await getMainModels();
    return Facility.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createFacility: adminMutation
    .input(
      z.object({
        title: z.string().min(2),
        category: z.string().default("Campus"),
        description: z.string().min(5),
        icon: z.string().default("Microscope"),
        imageUrl: z.string().optional(),
        geometry: z.string().optional(),
        color: z.string().optional(),
        accent: z.string().optional(),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Facility } = await getMainModels();
      return Facility.create(input);
    }),
  updateFacility: adminMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2),
        category: z.string().default("Campus"),
        description: z.string().min(5),
        icon: z.string().default("Microscope"),
        imageUrl: z.string().optional(),
        geometry: z.string().optional(),
        color: z.string().optional(),
        accent: z.string().optional(),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Facility } = await getMainModels();
      return Facility.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteFacility: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Facility } = await getMainModels();
      return Facility.findByIdAndUpdate(input.id, { isDeleted: true });
    }),


  // --- 29. DEPARTMENTS & CURRICULUM ---
  listDepartments: publicQuery.query(async () => {
    const { Department } = await getMainModels();
    return Department.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createDepartment: adminMutation
    .input(
      z.object({
        name: z.string().min(2),
        subjects: z.string().min(2),
        icon: z.string().default("BookOpen"),
        color: z.string().default("bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Department } = await getMainModels();
      return Department.create(input);
    }),
  updateDepartment: adminMutation
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        subjects: z.string().min(2),
        icon: z.string().default("BookOpen"),
        color: z.string().default("bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Department } = await getMainModels();
      return Department.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteDepartment: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Department } = await getMainModels();
      return Department.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 30. ADMISSION STEPS ---
  listAdmissionSteps: publicQuery.query(async () => {
    const { AdmissionStep } = await getMainModels();
    return AdmissionStep.find({ isDeleted: false, isActive: true }).sort({ stepNumber: 1 });
  }),
  createAdmissionStep: adminMutation
    .input(
      z.object({
        stepNumber: z.number(),
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("FileText"),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { AdmissionStep } = await getMainModels();
      return AdmissionStep.create(input);
    }),
  updateAdmissionStep: adminMutation
    .input(
      z.object({
        id: z.string(),
        stepNumber: z.number(),
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("FileText"),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { AdmissionStep } = await getMainModels();
      return AdmissionStep.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteAdmissionStep: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { AdmissionStep } = await getMainModels();
      return AdmissionStep.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 31. FAQS ---
  listFaqs: publicQuery
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const { Faq } = await getMainModels();
      const filter: any = { isDeleted: false, isActive: true };
      if (input?.category) filter.category = input.category;
      return Faq.find(filter).sort({ order: 1 });
    }),
  createFaq: adminMutation
    .input(
      z.object({
        question: z.string().min(3),
        answer: z.string().min(3),
        category: z.string().default("Admissions"),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Faq } = await getMainModels();
      return Faq.create(input);
    }),
  updateFaq: adminMutation
    .input(
      z.object({
        id: z.string(),
        question: z.string().min(3),
        answer: z.string().min(3),
        category: z.string().default("Admissions"),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Faq } = await getMainModels();
      return Faq.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteFaq: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Faq } = await getMainModels();
      return Faq.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 32. TIMELINE & MILESTONES ---
  listTimeline: publicQuery.query(async () => {
    const { TimelineItem } = await getMainModels();
    return TimelineItem.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createTimelineItem: adminMutation
    .input(
      z.object({
        year: z.string().min(2),
        title: z.string().min(2),
        description: z.string().min(5),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { TimelineItem } = await getMainModels();
      return TimelineItem.create(input);
    }),
  updateTimelineItem: adminMutation
    .input(
      z.object({
        id: z.string(),
        year: z.string().min(2),
        title: z.string().min(2),
        description: z.string().min(5),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { TimelineItem } = await getMainModels();
      return TimelineItem.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteTimelineItem: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { TimelineItem } = await getMainModels();
      return TimelineItem.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 33. CORE VALUES ---
  listCoreValues: publicQuery.query(async () => {
    const { CoreValue } = await getMainModels();
    return CoreValue.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createCoreValue: adminMutation
    .input(
      z.object({
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("Target"),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { CoreValue } = await getMainModels();
      return CoreValue.create(input);
    }),
  updateCoreValue: adminMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("Target"),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { CoreValue } = await getMainModels();
      return CoreValue.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteCoreValue: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { CoreValue } = await getMainModels();
      return CoreValue.findByIdAndUpdate(input.id, { isDeleted: true });
    }),

  // --- 34. 3D FEATURE CARDS (Home2) ---
  listFeatureCards: publicQuery.query(async () => {
    const { FeatureCard } = await getMainModels();
    return FeatureCard.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
  }),
  createFeatureCard: adminMutation
    .input(
      z.object({
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("Bot"),
        category: z.string().optional(),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { FeatureCard } = await getMainModels();
      return FeatureCard.create(input);
    }),
  updateFeatureCard: adminMutation
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2),
        description: z.string().min(5),
        icon: z.string().default("Bot"),
        category: z.string().optional(),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { FeatureCard } = await getMainModels();
      return FeatureCard.findByIdAndUpdate(id, data, { new: true });
    }),
  deleteFeatureCard: adminMutation
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { FeatureCard } = await getMainModels();
      return FeatureCard.findByIdAndUpdate(input.id, { isDeleted: true });
    }),
});

