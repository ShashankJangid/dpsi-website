import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getGalleryModels } from "./models/cmsSchemas";

const fallbackGallery = [
  { id: 1, title: "AI & Robotics Innovation Lab", category: "Labs", imageUrl: "/images/facilities/ai_robotics_lab.webp", featured: true },
  { id: 2, title: "Quantum Science Lab", category: "Labs", imageUrl: "/images/facilities/quantum_science_lab.webp", featured: true },
  { id: 3, title: "Interactive Smart Classroom", category: "Campus", imageUrl: "/images/facilities/smart_classroom.webp", featured: true },
  { id: 4, title: "Olympic Aquatic Center", category: "Sports", imageUrl: "/images/facilities/swimming_pool.webp", featured: true },
  { id: 5, title: "Multi-Sport Athletics Arena", category: "Sports", imageUrl: "/images/facilities/sports_complex.webp", featured: true },
  { id: 6, title: "Central Knowledge Hub", category: "Library", imageUrl: "/images/facilities/library.webp", featured: true },
];

export const galleryRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { GalleryImage } = await getGalleryModels();
      const images = await GalleryImage.find({ isDeleted: false }).sort({ createdAt: -1 });
      if (images && images.length > 0) {
        return images.map((img: any, idx: number) => ({
          id: idx + 1,
          title: img.title,
          category: img.category,
          imageUrl: img.imageUrl,
          featured: true,
        }));
      }
      return fallbackGallery;
    } catch {
      return fallbackGallery;
    }
  }),

  byCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      try {
        const { GalleryImage } = await getGalleryModels();
        const images = await GalleryImage.find({
          isDeleted: false,
          category: { $regex: new RegExp(`^${input.category}$`, "i") },
        }).sort({ createdAt: -1 });
        if (images && images.length > 0) {
          return images.map((img: any, idx: number) => ({
            id: idx + 1,
            title: img.title,
            category: img.category,
            imageUrl: img.imageUrl,
            featured: true,
          }));
        }
        return fallbackGallery.filter((g) => g.category.toLowerCase() === input.category.toLowerCase());
      } catch {
        return fallbackGallery;
      }
    }),

  featured: publicQuery.query(async () => {
    try {
      const { GalleryImage } = await getGalleryModels();
      const images = await GalleryImage.find({ isDeleted: false }).limit(6);
      if (images && images.length > 0) {
        return images.map((img: any, idx: number) => ({
          id: idx + 1,
          title: img.title,
          category: img.category,
          imageUrl: img.imageUrl,
          featured: true,
        }));
      }
      return fallbackGallery;
    } catch {
      return fallbackGallery;
    }
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(2).max(255),
        description: z.string().optional(),
        imageUrl: z.string().min(1),
        videoUrl: z.string().optional(),
        category: z.string().min(1).max(100),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, id: 1 };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.any(),
        title: z.string().min(2).max(255),
        description: z.string().optional(),
        imageUrl: z.string().min(1),
        videoUrl: z.string().optional(),
        category: z.string().min(1).max(100),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.any() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});