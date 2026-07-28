import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import { env } from "../api/lib/env";

const db = drizzle(env.databaseUrl, { mode: "planetscale", schema });

async function seed() {
  console.log("Seeding database...");

  await db.insert(schema.stats).values([
    { label: "Years of Excellence", value: "20+", icon: "Calendar", order: 1, active: true },
    { label: "Students Enrolled", value: "5,000+", icon: "Users", order: 2, active: true },
    { label: "Faculty Members", value: "300+", icon: "GraduationCap", order: 3, active: true },
    { label: "Alumni Network", value: "25,000+", icon: "Network", order: 4, active: true },
    { label: "CBSE Results", value: "99.9%", icon: "Award", order: 5, active: true },
    { label: "Sports Facilities", value: "15+", icon: "Trophy", order: 6, active: true },
  ]);

  await db.insert(schema.announcements).values([
    { title: "Admissions Open for Session 2026-27", link: "/admissions", active: true, priority: 10 },
    { title: "CBSE Class X Board Results 2025-26 Declared", link: "/academics", active: true, priority: 9 },
    { title: "21st Annual Day Celebration - Register Now", link: "/events", active: true, priority: 8 },
  ]);

  await db.insert(schema.testimonials).values([
    {
      name: "B V Wanchoo",
      role: "Governor of Goa",
      content: "It was indeed a great pleasure for me to visit this most wonderful school. The atmosphere of the school was fantastic. I was deeply impressed with the spirit and ethos of the school.",
      featured: true,
    },
    {
      name: "Gen VK Singh (Retd)",
      role: "Former Army Chief",
      content: "It was a pleasure to be with the school. Wish you all the very best and all the success. The discipline and academic rigor here is truly commendable.",
      featured: true,
    },
    {
      name: "Professor A. Maini",
      role: "Vice President, Ritsumeikan Asia Pacific University, Japan",
      content: "A great school to visit and realize the high level of education offered here. I am truly impressed by the students, excellent teachers and an illustrious principal.",
      featured: true,
    },
  ]);

  await db.insert(schema.achievements).values([
    { studentName: "Siddhant Tiwari", class: "Class X", score: "99.4%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Ansh Pathak", class: "Class X", score: "99.4%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Aayush Jha", class: "Class X", score: "99.2%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Arnav Jha", class: "Class X", score: "99.2%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Chinmaya Shankar", class: "Class X", score: "99%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Pawni Srivastava", class: "Class XII Science", score: "97.2%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Aditya Kumar", class: "Class XII Science", score: "96.8%", exam: "CBSE Board", year: "2026", featured: true },
    { studentName: "Jia Manchanda", class: "Class XII Commerce", score: "98.2%", exam: "CBSE Board", year: "2026", featured: true },
  ]);

  await db.insert(schema.news).values([
    {
      title: "DPS Indirapuram Wins National Robotics Championship",
      slug: "national-robotics-championship",
      excerpt: "Our students brought home the trophy at the National Robotics Championship held in Bangalore.",
      content: "Detailed content about the robotics championship...",
      category: "Achievements",
      published: true,
      featured: true,
    },
    {
      title: "New AI Lab Inaugurated by Dr. APJ Abdul Kalam Foundation",
      slug: "ai-lab-inauguration",
      excerpt: "State-of-the-art AI and Machine Learning lab inaugurated for senior students.",
      content: "Detailed content about the AI lab inauguration...",
      category: "Infrastructure",
      published: true,
      featured: true,
    },
    {
      title: "Annual Sports Meet 2026 - A Grand Success",
      slug: "annual-sports-meet-2026",
      excerpt: "Over 2000 students participated in the Annual Sports Meet showcasing athletic excellence.",
      content: "Detailed content about the sports meet...",
      category: "Sports",
      published: true,
      featured: true,
    },
  ]);

  await db.insert(schema.events).values([
    {
      title: "Annual Day Celebration 2026",
      description: "A grand celebration of our school's 21st anniversary with cultural performances.",
      eventDate: new Date("2026-05-15"),
      location: "School Auditorium",
      category: "Annual",
    },
    {
      title: "Parent-Teacher Meeting",
      description: "Quarterly PTM for all classes to discuss student progress.",
      eventDate: new Date("2026-05-20"),
      location: "Respective Classrooms",
      category: "Academic",
    },
    {
      title: "Inter-School Debate Competition",
      description: "Annual debate competition hosting 20+ schools from across the region.",
      eventDate: new Date("2026-06-05"),
      location: "School Amphitheatre",
      category: "Competition",
    },
  ]);

  await db.insert(schema.gallery).values([
    { title: "Robotics Lab", description: "Students working on advanced robotics projects", imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=80", category: "Labs", featured: true },
    { title: "Sports Ground", description: "Olympic-sized sports facilities", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", category: "Sports", featured: true },
    { title: "Library", description: "State-of-the-art digital library", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80", category: "Library", featured: true },
    { title: "Science Lab", description: "Modern science laboratories", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", category: "Labs", featured: true },
    { title: "Annual Day", description: "Cultural performances by students", imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", category: "Events", featured: true },
    { title: "Basketball Court", description: "Indoor basketball arena", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", category: "Sports", featured: true },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);