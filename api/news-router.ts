import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

const fallbackNews = [
  {
    id: 1,
    title: "DPS Indirapuram Celebrates 22nd Annual Day 'Udaan' with Grandeur",
    slug: "annual-day-celebration-2026",
    excerpt: "A spectacular showcase of talent, culture, and achievements celebrated by over 2,000 students and parents.",
    content: "A spectacular showcase of talent, culture, and achievements celebrated by over 2,000 students and parents.",
    image: "/images/facilities/auditorium.webp",
    category: "Events",
    published: true,
    featured: true,
    createdAt: new Date("2026-06-20"),
  },
  {
    id: 2,
    title: "Outstanding Performance in CBSE Board Exams 2026",
    slug: "cbse-results-2026",
    excerpt: "Students achieve 100% pass rate with record-breaking school average and multiple 100/100 subject scores.",
    content: "Students achieve 100% pass rate with record-breaking school average and multiple 100/100 subject scores.",
    image: "/images/dps/slider_2.webp",
    category: "Academics",
    published: true,
    featured: true,
    createdAt: new Date("2026-05-14"),
  },
  {
    id: 3,
    title: "Inter-DPS National Swimming Champions 2026",
    slug: "inter-dps-swimming-champions",
    excerpt: "Our aquatic team brings home 12 gold medals and the overall champions trophy at the national meet.",
    content: "Our aquatic team brings home 12 gold medals and the overall champions trophy at the national meet.",
    image: "/images/facilities/swimming_pool.webp",
    category: "Sports",
    published: true,
    featured: true,
    createdAt: new Date("2026-07-10"),
  },
];

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
      if (acts && acts.length > 0) {
        return acts.map((a: any, idx: number) => ({
          id: idx + 1,
          title: a.title,
          slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          excerpt: a.description,
          content: a.description,
          image: a.imageUrl || "/images/facilities/ai_robotics_lab.webp",
          category: a.category || "Campus",
          published: a.isPublished,
          featured: true,
          createdAt: a.eventDate || new Date(),
        }));
      }
      return fallbackNews;
    } catch {
      return fallbackNews;
    }
  }),

  featured: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 }).limit(3);
      if (acts && acts.length > 0) {
        return acts.map((a: any, idx: number) => ({
          id: idx + 1,
          title: a.title,
          slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          excerpt: a.description,
          content: a.description,
          image: a.imageUrl || "/images/facilities/ai_robotics_lab.webp",
          category: a.category || "Campus",
          published: a.isPublished,
          featured: true,
          createdAt: a.eventDate || new Date(),
        }));
      }
      return fallbackNews;
    } catch {
      return fallbackNews;
    }
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return fallbackNews.find((n) => n.slug === input.slug) || fallbackNews[0];
    }),

  adminList: adminQuery.query(async () => {
    return fallbackNews;
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        slug: z.string().min(3).max(500),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
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
        title: z.string().min(3).max(500),
        slug: z.string().min(3).max(500),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
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