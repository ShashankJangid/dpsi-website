import { getMainModels } from "../models/cmsSchemas";

export async function seedDatabase() {
  try {
    const {
      SiteSettings,
      Achievement,
      Testimonial,
      Leadership,
      Facility,
      Department,
      AdmissionStep,
      Faq,
      QuickStat,
      TimelineItem,
      CoreValue,
      Slider,
    } = await getMainModels();

    // 1. SITE SETTINGS
    const defaultSettings = [
      { key: "school_name", value: "Delhi Public School Indirapuram", label: "School Name", group: "general" },
      { key: "school_tagline", value: "Service Before Self • Nurturing Global Leaders", label: "School Tagline", group: "general" },
      { key: "cbse_affiliation_no", value: "2130663", label: "CBSE Affiliation No.", group: "general" },
      { key: "school_code", value: "60297", label: "School Code", group: "general" },
      { key: "contact_phone", value: "+91-0120-4660000, 4670000", label: "Primary Phone", group: "contact" },
      { key: "contact_email", value: "info@dpsindirapuram.com", label: "General Email", group: "contact" },
      { key: "contact_admissions_email", value: "admissions@dpsindirapuram.com", label: "Admissions Email", group: "contact" },
      { key: "contact_address", value: "526/1, Ahinsa Khand-II, Indirapuram, Ghaziabad, U.P. - 201014", label: "Campus Address", group: "contact" },
      { key: "office_hours", value: "Monday – Saturday: 8:00 AM – 3:00 PM (Second & Fourth Saturdays Closed)", label: "Visiting Hours", group: "contact" },
      { key: "google_map_embed_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9961138244976!2d77.37397757620296!3d28.63073038421833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf007c65c2b09%3A0xe5a36378e9b88235!2sDelhi%20Public%20School%20Indirapuram!5e0!3m2!1sen!2sin!4v1700000000000", label: "Google Maps Embed URL", group: "contact" },
      { key: "social_facebook", value: "https://www.facebook.com/DPSIndirapuramGhaziabad", label: "Facebook Page", group: "social" },
      { key: "social_instagram", value: "https://www.instagram.com/dps_indirapuram/", label: "Instagram Profile", group: "social" },
      { key: "social_youtube", value: "https://www.youtube.com/channel/UC-jQAVRh4pBXEktpml3yeIQ/videos", label: "YouTube Channel", group: "social" },
      { key: "social_linkedin", value: "https://www.linkedin.com/school/dps-indirapuram/", label: "LinkedIn Page", group: "social" },
      { key: "social_twitter", value: "https://twitter.com/dps_indirapuram", label: "Twitter / X Profile", group: "social" },
      { key: "principal_name", value: "Ms. Priya Elizabeth John", label: "Principal Name", group: "principal" },
      { key: "principal_title", value: "Principal, DPS Indirapuram", label: "Principal Title", group: "principal" },
      { key: "principal_badge", value: "Principal's Message", label: "Principal Badge", group: "principal" },
      { key: "principal_headline", value: "Nurturing Future Leaders with Values & Innovation", label: "Principal Headline", group: "principal" },
      { key: "principal_image", value: "/images/leadership/priya_john.webp", label: "Principal Image URL", group: "principal" },
      { key: "principal_message_p1", value: "Welcome to Delhi Public School Indirapuram, where we believe in empowering every child to discover their unique potential. Our institution stands as a beacon of excellence, combining traditional values with futuristic pedagogical methods.", label: "Principal Message (Paragraph 1)", group: "principal" },
      { key: "principal_message_p2", value: "With over two decades of educational leadership, our state-of-the-art facilities, dedicated educators, and holistic curricula ensure that every student thrives with confidence, character, and intellect.", label: "Principal Message (Paragraph 2)", group: "principal" },
      { key: "cta_badge", value: "Admissions Open 2026-27", label: "CTA Badge", group: "cta" },
      { key: "cta_title", value: "Ready to Shape Your Child's Bright Future?", label: "CTA Title", group: "cta" },
      { key: "cta_subtitle", value: "Join the DPS Indirapuram family and empower your child with world-class education, futuristic technology, and holistic values.", label: "CTA Subtitle", group: "cta" },
      { key: "cta_button_text", value: "Apply for Admission", label: "CTA Button Text", group: "cta" },
      { key: "cta_button_link", value: "/admissions", label: "CTA Button Link", group: "cta" },
      { key: "footer_copyright", value: "© 2026 Delhi Public School Indirapuram. All rights reserved.", label: "Footer Copyright", group: "general" },
    ];

    for (const s of defaultSettings) {
      await SiteSettings.findOneAndUpdate(
        { key: s.key },
        { $setOnInsert: s },
        { upsert: true, new: true }
      );
    }

    // 2. ACHIEVEMENTS / TOPPERS
    const achievementCount = await Achievement.countDocuments({ isDeleted: false });
    if (achievementCount === 0) {
      await Achievement.insertMany([
        {
          studentName: "Siddhant Tiwari",
          className: "Class X",
          score: "99.4%",
          exam: "CBSE Board Examination",
          stream: "All India Rank #1",
          rank: "#1 Rank (Class X)",
          year: "2025-26",
          imageUrl: "/images/dps/topper_siddhant.webp",
          featured: true,
          order: 1,
        },
        {
          studentName: "Ansh Pathak",
          className: "Class X",
          score: "99.4%",
          exam: "CBSE Board Examination",
          stream: "All India Rank #1",
          rank: "#1 Rank (Class X)",
          year: "2025-26",
          imageUrl: "/images/dps/topper_ansh.webp",
          featured: true,
          order: 2,
        },
        {
          studentName: "Aayush Jha",
          className: "Class X",
          score: "99.2%",
          exam: "CBSE Board Examination",
          stream: "All India Rank #2",
          rank: "#2 Rank (Class X)",
          year: "2025-26",
          imageUrl: "/images/dps/topper_aayush.webp",
          featured: true,
          order: 3,
        },
        {
          studentName: "Arnav Jha",
          className: "Class X",
          score: "99.2%",
          exam: "CBSE Board Examination",
          stream: "All India Rank #2",
          rank: "#2 Rank (Class X)",
          year: "2025-26",
          imageUrl: "/images/dps/topper_arnav.webp",
          featured: true,
          order: 4,
        },
        {
          studentName: "Jia Manchanda",
          className: "Class XII",
          score: "98.2%",
          exam: "CBSE Board Examination",
          stream: "Commerce Stream Topper",
          rank: "School Rank 1",
          year: "2025-26",
          imageUrl: "/images/dps/topper_jia.webp",
          featured: true,
          order: 5,
        },
        {
          studentName: "Snigdha Shukla",
          className: "Class XII",
          score: "97.6%",
          exam: "CBSE Board Examination",
          stream: "Humanities Stream Topper",
          rank: "School Rank 1",
          year: "2025-26",
          imageUrl: "/images/dps/topper_snigdha.webp",
          featured: true,
          order: 6,
        },
        {
          studentName: "Pawni Srivastava",
          className: "Class XII",
          score: "97.2%",
          exam: "CBSE Board Examination",
          stream: "Science Stream Topper",
          rank: "School Rank 1",
          year: "2025-26",
          imageUrl: "/images/dps/topper_pawni.webp",
          featured: true,
          order: 7,
        },
      ]);
    }

    // 3. TESTIMONIALS
    const testimonialCount = await Testimonial.countDocuments({ isDeleted: false });
    if (testimonialCount === 0) {
      await Testimonial.insertMany([
        {
          name: "Dr. Rajesh Sharma",
          role: "Parent of Class XII Student",
          content: "The holistic environment and focus on futuristic technology like AI & Robotics at DPS Indirapuram helped my child excel academically while developing strong leadership skills.",
          avatarUrl: "/images/leadership/priya_john.webp",
          rating: 5,
          featured: true,
          order: 1,
        },
        {
          name: "Meenakshi Verma",
          role: "Parent of Class X Student",
          content: "The dedicated faculty, Olympic-level sports facilities, and personal attention given to each student makes DPS Indirapuram truly the top school in the NCR.",
          avatarUrl: "/images/leadership/santosh_bansal.webp",
          rating: 5,
          featured: true,
          order: 2,
        },
        {
          name: "Col. Sanjeev Tyagi",
          role: "Parent of Class VIII Student",
          content: "Discipline, character building, and academic brilliance are ingrained in every DPS Indirapuram student. We are proud parents!",
          avatarUrl: "/images/leadership/vk_shunglu.webp",
          rating: 5,
          featured: true,
          order: 3,
        },
      ]);
    }

    // 4. LEADERSHIP
    const leadershipCount = await Leadership.countDocuments({ isDeleted: false });
    if (leadershipCount === 0) {
      await Leadership.insertMany([
        {
          name: "Mr. V.K. Shunglu",
          role: "Chairman, DPS Society & Managing Committee",
          designation: "Chairman",
          bio: "Eminent civil servant and former Comptroller and Auditor General of India, providing visionary leadership to DPS Society institutions across the world.",
          imageUrl: "/images/leadership/vk_shunglu.webp",
          order: 1,
          category: "Management",
        },
        {
          name: "Ms. Santosh Bansal",
          role: "Pro-Vice Chairperson",
          designation: "Pro-Vice Chairperson",
          bio: "Pioneering educator and administrator committed to cultivating world-class educational opportunities and infrastructure for students.",
          imageUrl: "/images/leadership/santosh_bansal.webp",
          order: 2,
          category: "Management",
        },
        {
          name: "Ms. Priya Elizabeth John",
          role: "Principal, DPS Indirapuram",
          designation: "Principal",
          bio: "National Award-winning educator driving innovation in CBSE pedagogy, holistic student well-being, and future-ready robotics curriculum.",
          imageUrl: "/images/leadership/priya_john.webp",
          order: 3,
          category: "Principal",
        },
      ]);
    }

    // 5. FACILITIES
    const facilityCount = await Facility.countDocuments({ isDeleted: false });
    if (facilityCount === 0) {
      await Facility.insertMany([
        {
          title: "Futuristic AI & Robotics Lab",
          category: "Innovation",
          description: "Next-gen AI/ML research center equipped with humanoid robots, Arduino/Raspberry Pi workstations, 3D printers, and expert mentors.",
          icon: "Microscope",
          imageUrl: "/images/facilities/ai_robotics_lab.webp",
          order: 1,
        },
        {
          title: "Advanced Science Laboratories",
          category: "Academics",
          description: "State-of-the-art Physics, Chemistry, and Biology laboratories equipped with modern precision apparatus and safety systems.",
          icon: "FlaskConical",
          imageUrl: "/images/facilities/science_lab.webp",
          order: 2,
        },
        {
          title: "Next-Gen Smart Classrooms",
          category: "Infrastructure",
          description: "Equipped with interactive digital touchboards, ergonomic learning pods, and high-speed gigabit connectivity.",
          icon: "Wifi",
          imageUrl: "/images/facilities/smart_classroom.webp",
          order: 3,
        },
        {
          title: "Sports & Aquatic Complex",
          category: "Sports",
          description: "Olympic-size swimming pool, basketball courts, cricket ground, athletics track, and indoor badminton courts.",
          icon: "Dumbbell",
          imageUrl: "/images/facilities/swimming_pool.webp",
          order: 4,
        },
        {
          title: "Digital Knowledge Library",
          category: "Academics",
          description: "A vast repository of 50,000+ books, digital archives, e-journals, and quiet reading spaces for focused study.",
          icon: "BookOpen",
          imageUrl: "/images/facilities/library.webp",
          order: 5,
        },
        {
          title: "Performing Arts & Music Studio",
          category: "Arts",
          description: "Professional music rooms, dance studios, and an auditorium with stage lighting and acoustics.",
          icon: "Music",
          imageUrl: "/images/facilities/music_dance.webp",
          order: 6,
        },
        {
          title: "Art & Craft Studio",
          category: "Arts",
          description: "Spacious art studios for painting, sculpture, pottery, and craft with professional-grade materials.",
          icon: "Palette",
          imageUrl: "/images/facilities/art_craft_studio.webp",
          order: 7,
        },
        {
          title: "GPS AC Transportation",
          category: "Transport",
          description: "Fleet of 50+ GPS-enabled AC buses covering all major areas with trained drivers and attendants.",
          icon: "Bus",
          imageUrl: "/images/facilities/transport_bus.webp",
          order: 8,
        },
        {
          title: "Campus Safety & Security",
          category: "Safety",
          description: "24/7 CCTV surveillance, trained security personnel, fire safety systems, and emergency response protocols.",
          icon: "Shield",
          imageUrl: "/images/facilities/campus_security.webp",
          order: 9,
        },
        {
          title: "Health & Medical Center",
          category: "Health",
          description: "On-campus medical facility with qualified nurses, annual health checkups, and counseling services.",
          icon: "HeartPulse",
          imageUrl: "/images/facilities/medical_infirmary.webp",
          order: 10,
        },
      ]);
    }

    // 6. ACADEMIC DEPARTMENTS
    const departmentCount = await Department.countDocuments({ isDeleted: false });
    if (departmentCount === 0) {
      await Department.insertMany([
        {
          name: "Science",
          subjects: "Physics, Chemistry, Biology, Biotechnology",
          icon: "FlaskConical",
          color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
          order: 1,
        },
        {
          name: "Mathematics",
          subjects: "Pure Math, Applied Math, Statistics",
          icon: "Calculator",
          color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
          order: 2,
        },
        {
          name: "Languages",
          subjects: "English, Hindi, Sanskrit, French, German",
          icon: "Globe",
          color: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
          order: 3,
        },
        {
          name: "Arts & Humanities",
          subjects: "History, Geography, Political Science, Economics, Psychology",
          icon: "Palette",
          color: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
          order: 4,
        },
        {
          name: "Computer Science & AI",
          subjects: "Artificial Intelligence, Robotics, Python, Web Dev, Data Science",
          icon: "Cpu",
          color: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
          order: 5,
        },
        {
          name: "Physical Education",
          subjects: "Sports Science, Athletics, Yoga, Health Education",
          icon: "Activity",
          color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
          order: 6,
        },
      ]);
    }

    // 7. ADMISSION STEPS
    const stepCount = await AdmissionStep.countDocuments({ isDeleted: false });
    if (stepCount === 0) {
      await AdmissionStep.insertMany([
        {
          stepNumber: 1,
          title: "Online Registration",
          description: "Fill out the online application form with student bio-data and parent details.",
          icon: "FileText",
          order: 1,
        },
        {
          stepNumber: 2,
          title: "Document Submission",
          description: "Upload necessary documents: birth certificate, previous report cards, and transfer certificate.",
          icon: "ClipboardList",
          order: 2,
        },
        {
          stepNumber: 3,
          title: "Registration Fee Payment",
          description: "Pay the registration processing fee securely via our instant payment gateway.",
          icon: "CreditCard",
          order: 3,
        },
        {
          stepNumber: 4,
          title: "Student Interaction & Assessment",
          description: "Participate in an interactive evaluation designed to understand the child's academic and emotional readiness.",
          icon: "BadgeCheck",
          order: 4,
        },
        {
          stepNumber: 5,
          title: "Admission Formalities & Onboarding",
          description: "Receive admission confirmation letter and complete the enrollment formalities.",
          icon: "CheckCircle",
          order: 5,
        },
      ]);
    }

    // 8. FAQS
    const faqCount = await Faq.countDocuments({ isDeleted: false });
    if (faqCount === 0) {
      await Faq.insertMany([
        {
          question: "What is the age criteria for admission to Pre-School / Nursery?",
          answer: "The child should be 3+ years as of March 31st of the admission academic year.",
          category: "Admissions",
          order: 1,
        },
        {
          question: "What documents are required for the admission process?",
          answer: "Birth certificate, passport-size photographs of student & parents, previous report card, transfer certificate (Class II upwards), and proof of residence.",
          category: "Admissions",
          order: 2,
        },
        {
          question: "Is there an entrance examination for higher classes?",
          answer: "An age-appropriate competency assessment is conducted for Class I onwards to understand baseline readiness.",
          category: "Admissions",
          order: 3,
        },
        {
          question: "What is the fee structure and scholarship policy?",
          answer: "Please contact our admissions office or refer to the fee breakdown table. Merit scholarships are offered for national Olympiad winners and sports champions.",
          category: "Admissions",
          order: 4,
        },
        {
          question: "Does the school provide GPS-monitored AC bus transport?",
          answer: "Yes, we operate an extensive fleet of air-conditioned GPS-tracked buses covering Ghaziabad, Noida, and East Delhi.",
          category: "Transport",
          order: 5,
        },
        {
          question: "What is the average student-teacher ratio?",
          answer: "We strictly maintain a 25:1 student-to-educator ratio to guarantee individual attention and care.",
          category: "General",
          order: 6,
        },
      ]);
    }

    // 9. QUICK STATS
    const statCount = await QuickStat.countDocuments({ isDeleted: false });
    if (statCount === 0) {
      await QuickStat.insertMany([
        { label: "Students Enrolled", value: "3,500+", icon: "GraduationCap", order: 1 },
        { label: "CBSE Board Average", value: "88.6%", icon: "Award", order: 2 },
        { label: "Expert Educators", value: "220+", icon: "Users", order: 3 },
        { label: "Campus Area", value: "10 Acres", icon: "Building", order: 4 },
      ]);
    }

    // 10. TIMELINE / MILESTONES
    const timelineCount = await TimelineItem.countDocuments({ isDeleted: false });
    if (timelineCount === 0) {
      await TimelineItem.insertMany([
        { year: "2003", title: "Foundation", description: "DPS Indirapuram established under the aegis of The DPS Society.", order: 1 },
        { year: "2008", title: "CBSE Affiliation", description: "Granted permanent CBSE affiliation with exemplary rating.", order: 2 },
        { year: "2012", title: "First Batch Success", description: "100% CBSE board results with multiple students securing >95%.", order: 3 },
        { year: "2015", title: "Sports Complex", description: "Inaugurated Olympic-size aquatic complex and national sports grounds.", order: 4 },
        { year: "2021", title: "Digital Transformation", description: "Complete smart classroom and digital infrastructure upgrade.", order: 5 },
        { year: "2023", title: "20th Anniversary", description: "Celebrated two decades of holistic excellence and character building.", order: 6 },
        { year: "2024", title: "AI & Robotics Lab", description: "State-of-the-art innovation center launched with humanoid robotics kits.", order: 7 },
        { year: "2025", title: "Global Recognition", description: "Ranked among top CBSE schools in India with British Council ISA honors.", order: 8 },
      ]);
    }

    // 11. CORE VALUES
    const valueCount = await CoreValue.countDocuments({ isDeleted: false });
    if (valueCount === 0) {
      await CoreValue.insertMany([
        {
          title: "Excellence",
          description: "Striving for the highest standards in education and character development.",
          icon: "Target",
          order: 1,
        },
        {
          title: "Integrity",
          description: "Building honest, ethical individuals who lead with moral courage.",
          icon: "Heart",
          order: 2,
        },
        {
          title: "Inclusivity",
          description: "Celebrating diversity and creating a welcoming environment for all.",
          icon: "Users",
          order: 3,
        },
        {
          title: "Innovation",
          description: "Embracing new ideas and technologies to prepare students for the future.",
          icon: "BookOpen",
          order: 4,
        },
        {
          title: "Resilience",
          description: "Developing grit and perseverance to overcome challenges with confidence.",
          icon: "Award",
          order: 5,
        },
      ]);
    }

    // 12. SLIDERS
    const sliderCount = await Slider.countDocuments({ isDeleted: false });
    if (sliderCount === 0) {
      await Slider.insertMany([
        {
          title: "Empowering Minds, Shaping Tomorrow",
          subtitle: "Ranked among the Top CBSE Schools in the National Capital Region with 20+ Years of Academic Legacy",
          imageUrl: "/images/dps/slider_1.webp",
          buttonText: "Explore Campus",
          buttonLink: "/about",
          order: 1,
        },
        {
          title: "Futuristic AI & Robotics Innovation",
          subtitle: "Equipping young minds with humanoid robotics, 3D prototyping, and cutting-edge STEM labs",
          imageUrl: "/images/dps/slider_2.webp",
          buttonText: "Discover Facilities",
          buttonLink: "/facilities",
          order: 2,
        },
        {
          title: "Admissions Open for Academic Session 2026-27",
          subtitle: "Give your child the foundation of holistic education, global exposure, and athletic excellence",
          imageUrl: "/images/dps/slider_3.webp",
          buttonText: "Apply Online",
          buttonLink: "/admissions",
          order: 3,
        },
      ]);
    }
  } catch (error) {
    console.warn("MongoDB Auto-Seeding warning:", error);
  }
}
