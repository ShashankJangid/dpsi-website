import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";

const fallbackTestimonials = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    role: "Parent of Class XII Student",
    content: "The holistic environment and focus on futuristic technology like AI & Robotics at DPS Indirapuram helped my child excel academically while developing strong leadership skills.",
    avatar: "/images/leadership/priya_john.webp",
    featured: true,
  },
  {
    id: 2,
    name: "Meenakshi Verma",
    role: "Parent of Class X Student",
    content: "The dedicated faculty, Olympic-level sports facilities, and personal attention given to each student makes DPS Indirapuram truly the top school in the NCR.",
    avatar: "/images/leadership/santosh_bansal.webp",
    featured: true,
  },
];

export const testimonialRouter = createRouter({
  list: publicQuery.query(async () => {
    return fallbackTestimonials;
  }),

  featured: publicQuery.query(async () => {
    return fallbackTestimonials;
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(2).max(255),
        role: z.string().min(2).max(255),
        content: z.string().min(10),
        avatar: z.string().optional(),
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
        name: z.string().min(2).max(255),
        role: z.string().min(2).max(255),
        content: z.string().min(10),
        avatar: z.string().optional(),
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