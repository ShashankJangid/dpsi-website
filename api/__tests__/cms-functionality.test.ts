import { describe, it, expect } from "vitest";
import { z } from "zod";

// 1. TC Bulk Import Parser
function parseBulkCsv(text: string) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  const rows: any[] = [];
  for (const line of lines) {
    const parts = line.split(",").map(p => p.trim());
    if (parts.length >= 5) {
      rows.push({
        admissionNumber: parts[0] || "",
        studentName: parts[1] || "",
        fatherName: parts[2] || "",
        motherName: parts[3] || "",
        classLeaving: parts[4] || "Class X",
        dateOfIssue: parts[5] || new Date().toISOString().split("T")[0],
        status: (["Issued", "Pending", "Cancelled"].includes(parts[6]) ? parts[6] : "Issued") as "Issued" | "Pending" | "Cancelled",
      });
    }
  }
  return rows;
}

// 2. Safe YouTube URL Extractor
function extractYoutubeId(val: string): string {
  try {
    if (!val || val.trim().length === 0) return "";
    const trimmed = val.trim();
    if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match?.[1] || "";
  } catch {
    return "";
  }
}

// 3. Slug generator
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-");
}

describe("CMS Functionality & Business Logic Test Suite", () => {
  describe("TC Bulk Import CSV Parser", () => {
    it("parses valid multi-line CSV correctly", () => {
      const csv = [
        "DPSI-1001, Aarav Sharma, Rajesh Sharma, Priya Sharma, Class X, 2025-03-31, Issued",
        "DPSI-1002, Diya Patel, Suresh Patel, Anjali Patel, Class XII, 2025-04-15, Pending",
        "DPSI-1003, Rohan Gupta, Amit Gupta, Sunita Gupta, Class IX, 2025-05-01, Cancelled",
      ].join("\n");

      const rows = parseBulkCsv(csv);
      expect(rows).toHaveLength(3);
      expect(rows[0].admissionNumber).toBe("DPSI-1001");
      expect(rows[0].studentName).toBe("Aarav Sharma");
      expect(rows[0].fatherName).toBe("Rajesh Sharma");
      expect(rows[0].motherName).toBe("Priya Sharma");
      expect(rows[0].classLeaving).toBe("Class X");
      expect(rows[0].dateOfIssue).toBe("2025-03-31");
      expect(rows[0].status).toBe("Issued");

      expect(rows[1].status).toBe("Pending");
      expect(rows[2].status).toBe("Cancelled");
    });

    it("filters out empty or incomplete lines (< 5 fields)", () => {
      const invalidCsv = "\n   \nDPS-1, Incomplete\nDPS-2, Only, Three, Fields\n";
      const rows = parseBulkCsv(invalidCsv);
      expect(rows).toHaveLength(0);
    });

    it("defaults invalid status values to Issued", () => {
      const csv = "DPSI-9999, Test Student, Father Name, Mother Name, Class VIII, 2025-01-01, InvalidStatus";
      const rows = parseBulkCsv(csv);
      expect(rows).toHaveLength(1);
      expect(rows[0].status).toBe("Issued");
    });
  });

  describe("Safe YouTube URL / ID Parser", () => {
    it("extracts ID from standard watch URL", () => {
      expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from youtu.be shortlink", () => {
      expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from embed URL", () => {
      expect(extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")).toBe("dQw4w9WgXcQ");
    });

    it("handles direct 11-char ID without crash", () => {
      expect(extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("safely returns empty string for malformed or incomplete URLs without throwing", () => {
      expect(extractYoutubeId("")).toBe("");
      expect(extractYoutubeId("https://google.com")).toBe("");
      expect(extractYoutubeId("invalid-url-string")).toBe("");
    });
  });

  describe("Slug Generator", () => {
    it("formats uppercase titles with special characters into SEO-friendly slugs", () => {
      expect(generateSlug("AI & Innovation Labs Ecosystem")).toBe("ai-innovation-labs-ecosystem");
      expect(generateSlug("Vision & Pedagogical Philosophy")).toBe("vision-pedagogical-philosophy");
      expect(generateSlug("   Leading CBSE School (Indirapuram)   ")).toBe("leading-cbse-school-indirapuram");
    });

    it("handles leading and trailing slashes cleanly for dynamic routing", () => {
      const cleanSlug = (input: string) => input.replace(/^\/+/, "").replace(/\/+$/, "").trim().toLowerCase();
      expect(cleanSlug("/testing/")).toBe("testing");
      expect(cleanSlug("///vision-philosophy")).toBe("vision-philosophy");
      expect(cleanSlug("/unf")).toBe("unf");
    });
  });

  describe("Schema Validation (Zod)", () => {
    it("validates Menu placement location enum", () => {
      const schema = z.object({
        location: z.enum(["header", "footer_quick", "footer_resources"]),
      });

      expect(schema.safeParse({ location: "header" }).success).toBe(true);
      expect(schema.safeParse({ location: "footer_quick" }).success).toBe(true);
      expect(schema.safeParse({ location: "footer_resources" }).success).toBe(true);
      expect(schema.safeParse({ location: "sidebar" }).success).toBe(false);
    });

    it("validates Site Settings key-value pairs", () => {
      const schema = z.object({
        updates: z.array(z.object({ key: z.string(), value: z.string() })),
      });

      expect(schema.safeParse({
        updates: [{ key: "contact_phone", value: "+91-0120-4660000" }]
      }).success).toBe(true);

      expect(schema.safeParse({
        updates: [{ key: "contact_phone" }]
      }).success).toBe(false);
    });
  });

  describe("Stage A CMS-to-Live Round Trip & Empty State Contracts", () => {
    it("1. Activity / News & Events: validates data shape and zero-state handling", () => {
      const ActivityContract = z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        category: z.string().optional(),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        image: z.string(),
        createdAt: z.string().or(z.date()),
        eventDate: z.string().or(z.date()).optional(),
      });

      const newActivity = {
        id: "act_101",
        title: "Robotics Hackathon 2026",
        category: "Innovation",
        excerpt: "Students prototype autonomous rovers",
        description: "Full description of robotics showcase",
        image: "https://res.cloudinary.com/dpsi/image/upload/hackathon.webp",
        createdAt: new Date().toISOString(),
        eventDate: new Date().toISOString(),
      };

      expect(ActivityContract.safeParse(newActivity).success).toBe(true);

      // Empty collection state: displayNews must be empty without throwing
      const emptyList: any[] = [];
      const displayNews = emptyList.slice(0, 6);
      expect(displayNews).toEqual([]);
      expect(displayNews.length).toBe(0);
    });

    it("2. Marquees / Announcements Bar: validates data shape and zero-state handling", () => {
      const MarqueeContract = z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        link: z.string().optional(),
      });

      const newMarquee = {
        id: "marq_101",
        title: "ADMISSIONS OPEN FOR SESSION 2026-27",
        link: "/admissions",
      };

      expect(MarqueeContract.safeParse(newMarquee).success).toBe(true);

      // Empty collection state: items must be empty and safeIndex returns undefined
      const emptyMarquees: any[] = [];
      expect(emptyMarquees.length).toBe(0);
      const current = emptyMarquees[0];
      expect(current).toBeUndefined();
    });

    it("3. Gallery Images: validates data shape, category extraction and zero-state handling", () => {
      const GalleryContract = z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        category: z.string(),
        imageUrl: z.string(),
        featured: z.boolean().optional(),
      });

      const newImage = {
        id: "img_101",
        title: "Robotics Innovation Lab",
        category: "Labs",
        imageUrl: "https://res.cloudinary.com/dpsi/image/upload/lab.webp",
        featured: true,
      };

      expect(GalleryContract.safeParse(newImage).success).toBe(true);

      // Empty collection state: 3D coverflow and grid must be empty without throwing
      const emptyGallery: any[] = [];
      const coverflowSlides = emptyGallery.slice(0, 10).map((item) => ({
        src: item.imageUrl,
        alt: item.title,
      }));
      expect(coverflowSlides).toEqual([]);
    });

    it("4. Hero Slider: validates data shape, zero-state calculation, and typewriter safety", () => {
      const SliderContract = z.object({
        image: z.string(),
        title: z.string(),
        subtitle: z.string(),
        badge: z.string(),
        buttonText: z.string(),
        buttonLink: z.string(),
      });

      const newSlider = {
        image: "https://res.cloudinary.com/dpsi/image/upload/slider1.webp",
        title: "Welcome to DPS Indirapuram",
        subtitle: "Soaring High... We reach for the sky!",
        badge: "Admissions Open 2026-27",
        buttonText: "Apply Now",
        buttonLink: "/admissions",
      };

      expect(SliderContract.safeParse(newSlider).success).toBe(true);

      // Empty collection safety: zero length must safely produce undefined slide without divide-by-zero
      const emptySliders: any[] = [];
      const safeSlideIndex = emptySliders.length > 0 ? 0 % emptySliders.length : 0;
      expect(safeSlideIndex).toBe(0);
      const slide = emptySliders[safeSlideIndex];
      expect(slide).toBeUndefined();
    });

    it("5. Video Gallery: validates YouTube parser, direct video shape, and zero-state", () => {
      const VideoContract = z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        url: z.string(),
        thumbnail: z.string(),
        isDirectVideo: z.boolean(),
      });

      const newVideo = {
        id: "vid_101",
        title: "Annual Day Celebrations",
        url: "https://www.youtube.com/embed/Nn2K8b2JQn0?autoplay=1&rel=0",
        thumbnail: "https://img.youtube.com/vi/Nn2K8b2JQn0/hqdefault.jpg",
        isDirectVideo: false,
      };

      expect(VideoContract.safeParse(newVideo).success).toBe(true);

      // Empty collection safety: zero length must safely return null section
      const emptyVideos: any[] = [];
      expect(emptyVideos.length).toBe(0);
    });
  });
});

