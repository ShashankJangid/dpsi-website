import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const eventsRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
      return acts.map((a: any) => ({
        id: a._id.toString(),
        _id: a._id.toString(),
        title: a.title,
        description: a.description,
        image: a.imageUrl || "",
        imageUrl: a.imageUrl || "",
        eventDate: a.eventDate || new Date(),
        location: "DPSI Campus",
        category: a.category || "Events",
      }));
    } catch {
      return [];
    }
  }),

  all: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
      return acts.map((a: any) => ({
        id: a._id.toString(),
        _id: a._id.toString(),
        title: a.title,
        description: a.description,
        image: a.imageUrl || "",
        imageUrl: a.imageUrl || "",
        eventDate: a.eventDate || new Date(),
        location: "DPSI Campus",
        category: a.category || "Events",
      }));
    } catch {
      return [];
    }
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(2).max(255),
        description: z.string().min(5),
        image: z.string().optional(),
        eventDate: z.string(),
        category: z.string().default("Events"),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      const doc = await Activity.create({
        title: input.title,
        description: input.description,
        imageUrl: input.image,
        eventDate: new Date(input.eventDate),
        category: input.category,
        isPublished: true,
      });
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2).max(255),
        description: z.string().min(5),
        image: z.string().optional(),
        eventDate: z.string(),
        category: z.string().default("Events"),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      await Activity.findByIdAndUpdate(input.id, {
        title: input.title,
        description: input.description,
        imageUrl: input.image,
        eventDate: new Date(input.eventDate),
        category: input.category,
      });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      await Activity.findByIdAndDelete(input.id);
      return { success: true };
    }),
});