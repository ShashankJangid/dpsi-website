/**
 * Official Annual Academic Calendar Knowledge Base (2026-2027)
 * Source: Delhi Public School Indirapuram (https://www.dpsindirapuram.com/calendar/annual-academic-calendar.pdf)
 */

export interface CalendarMonth {
  month: string;
  year: number;
  sessionEvents: string[];
  periodicTests: string[];
  majorExams: string[];
  ptms: string[];
  holidaysAndFestivals: string[];
  breaksAndLeaves: string[];
}

export const ANNUAL_ACADEMIC_CALENDAR: CalendarMonth[] = [
  {
    month: "April",
    year: 2026,
    sessionEvents: [
      "New Session begins for Nursery (Roll No. 1-20), LKG & UKG",
      "New Session begins for Nursery (Roll No. 21-40)",
      "New Session begins for Classes I to IX",
      "New Session begins for Class XI"
    ],
    periodicTests: [
      "PT (Class XII) regular test schedule starts",
      "PT-1 (Classes IX & X) periodic test begins"
    ],
    majorExams: [],
    ptms: [],
    holidaysAndFestivals: [
      "Good Friday",
      "Easter Sunday",
      "Ambedkar Jayanti",
      "Baisakhi"
    ],
    breaksAndLeaves: []
  },
  {
    month: "May",
    year: 2026,
    sessionEvents: [
      "Last working day before Summer Vacation for Nursery to Class II",
      "Last working day before Summer Vacation for Classes III to XII"
    ],
    periodicTests: [
      "PT (Class XII)",
      "PT-1 (Classes VI to X)",
      "PT-1 (Classes III to V)",
      "PT-1 (Class XI)",
      "PT-1 (Classes IV & V)"
    ],
    majorExams: [],
    ptms: [
      "PTM for Nursery to Class II",
      "PTM for Classes III to V",
      "PTM for Classes VI to VIII",
      "PTM for Classes IX & X",
      "PTM for Classes XI & XII"
    ],
    holidaysAndFestivals: [
      "Buddha Purnima",
      "Mother's Day",
      "Eid-Al-Adha"
    ],
    breaksAndLeaves: [
      "Summer Vacation begins towards end of May"
    ]
  },
  {
    month: "June",
    year: 2026,
    sessionEvents: [
      "School reopens after summer break for Classes X & XII"
    ],
    periodicTests: [
      "PT-2 (Class X)"
    ],
    majorExams: [
      "Mid Term Examinations (Class XII)"
    ],
    ptms: [],
    holidaysAndFestivals: [
      "Muharram",
      "International Yoga Day",
      "Father's Day",
      "World Music Day"
    ],
    breaksAndLeaves: [
      "Summer Vacation continues for Nursery to IX & Class XI"
    ]
  },
  {
    month: "July",
    year: 2026,
    sessionEvents: [
      "School reopens after summer break for Nursery to Class IX & Class XI"
    ],
    periodicTests: [
      "PT-1 (Classes VI-VIII & Class XI)",
      "PT-1 (Classes III to V)",
      "PT-2 (Classes IX & X)",
      "GK Test (Classes VI to VIII)"
    ],
    majorExams: [
      "Mid Term Examinations (Class XII) continue"
    ],
    ptms: [],
    holidaysAndFestivals: [
      "Kanwar Yatra holidays / traffic diversions (local observance)"
    ],
    breaksAndLeaves: []
  },
  {
    month: "August",
    year: 2026,
    sessionEvents: [],
    periodicTests: [
      "PT-2 (Class IX)",
      "GK Test (Classes III to V)"
    ],
    majorExams: [],
    ptms: [
      "PTM for Classes III to V",
      "PTM for Classes VI to VIII",
      "PTM for Classes XI & XII"
    ],
    holidaysAndFestivals: [
      "Kanwar Yatra / Sawan Shivratri",
      "Independence Day (15th August)",
      "Milad-Un-Nabi",
      "Raksha Bandhan"
    ],
    breaksAndLeaves: []
  },
  {
    month: "September",
    year: 2026,
    sessionEvents: [
      "Foundational Stage Assessments: Math Oral (Nur), Math Oral & Checklist (LKG & UKG), Math Assessment (I & II)",
      "English Assessment (I & II), EVS Oral (Nur-UKG), EVS Assessment (I & II), Hindi Assessment (I & II), Mental Math (I & II)"
    ],
    periodicTests: [],
    majorExams: [
      "Half Yearly Examinations (Classes IX to XII)",
      "Half Yearly Examinations (Classes VI to VIII)",
      "Half Yearly Examinations (Classes III to V)",
      "Preparatory Leaves scheduled between exam papers"
    ],
    ptms: [
      "PTM for Nursery to Class II",
      "PTM & handing over of Half Yearly Answer Scripts for Classes IX & X"
    ],
    holidaysAndFestivals: [
      "Janmashtami"
    ],
    breaksAndLeaves: []
  },
  {
    month: "October",
    year: 2026,
    sessionEvents: [
      "Answer Scripts showing to students & parents (Classes III to V)",
      "Answer Scripts showing to students & parents (Classes VI to VIII)"
    ],
    periodicTests: [
      "PT-3 (Class X) periodic tests start"
    ],
    majorExams: [],
    ptms: [
      "PTM for Classes XI & XII (Half Yearly performance review)"
    ],
    holidaysAndFestivals: [
      "Mahatma Gandhi Jayanti (2nd October)",
      "Lal Bahadur Shastri Jayanti (2nd October)",
      "Maha Navami",
      "Dussehra (Vijayadashami)",
      "Maharishi Valmiki Jayanti"
    ],
    breaksAndLeaves: [
      "Autumn / Dussehra Break"
    ]
  },
  {
    month: "November",
    year: 2026,
    sessionEvents: [],
    periodicTests: [
      "PT-2 (Classes III to V)",
      "PT-2 (Classes VI to VIII & Class XI)",
      "PT-3 (Class IX)",
      "PT-3 (Class X)"
    ],
    majorExams: [],
    ptms: [
      "PTM for Classes IX & X"
    ],
    holidaysAndFestivals: [
      "Narak Chaturdashi",
      "Diwali (Deepawali)",
      "Govardhan Puja",
      "Bhai Dooj",
      "Chhath Puja",
      "Guru Nanak Jayanti",
      "Guru Tegh Bahadur's Martyrdom Day"
    ],
    breaksAndLeaves: [
      "Diwali Break"
    ]
  },
  {
    month: "December",
    year: 2026,
    sessionEvents: [
      "Crossover Exam in Mathematics for Class VIII",
      "Primary & Pre-Primary Assessments: Math, English, Hindi, EVS Oral & Checklist (Nur to UKG)"
    ],
    periodicTests: [
      "PT-2 (Classes III to V)",
      "PT-2 (Classes VI to VIII)",
      "PT-2 (Class XI)",
      "PT-3 (Class IX)"
    ],
    majorExams: [
      "Pre-Board 1 (PB-1) Examinations for Class X",
      "Pre-Board (PB) Examinations for Class XII",
      "Pre-Board 2 (PB-2) Examinations begin for Class X",
      "Preparatory Leaves for Board appearing classes (X & XII)"
    ],
    ptms: [
      "PTM for Classes VI to VIII"
    ],
    holidaysAndFestivals: [
      "Christmas Day (25th December)"
    ],
    breaksAndLeaves: [
      "Winter Break begins for Nursery to Class XII towards end of December"
    ]
  },
  {
    month: "January",
    year: 2027,
    sessionEvents: [
      "School Reopens after Winter Break for Classes IX to XII (Early January)",
      "School Reopens after Winter Break for Nursery to Class VIII (Mid January)",
      "Crossover Examination in Mathematics for Class V",
      "GK Test for Classes VI to VIII"
    ],
    periodicTests: [],
    majorExams: [
      "Pre-Board 2 (PB-2) Examinations for Class X continued",
      "Annual Examinations for Class XI",
      "Annual Examinations for Class IX",
      "Preparatory leaves for Annual Exams (IX & XI)"
    ],
    ptms: [
      "PTM for Nursery to Class II",
      "PTM for Classes III to V",
      "PTM for Class XII",
      "PTM & handing over of Answer Scripts of Pre-Board 2 (Class X)"
    ],
    holidaysAndFestivals: [
      "Guru Gobind Singh Jayanti",
      "Makar Sankranti / Pongal / Lohri",
      "Republic Day (26th January)"
    ],
    breaksAndLeaves: [
      "Winter break concluding in January"
    ]
  },
  {
    month: "February",
    year: 2027,
    sessionEvents: [
      "Last Working Day for Classes IX & XI",
      "GK Test for Classes III to V",
      "Final Assessments for Classes I & II (English, Hindi, Math, Mental Math, EVS)"
    ],
    periodicTests: [],
    majorExams: [
      "Annual Examinations for Class IX & Class XI (concluding)",
      "Annual Examinations for Classes VI to VIII",
      "Annual Examinations for Classes III to V",
      "Preparatory leaves for Annual Exams"
    ],
    ptms: [
      "PTM & handing over of Annual Exam Answer Scripts to students/parents for Classes IX & XI"
    ],
    holidaysAndFestivals: [
      "Maha Shivratri (or observed in March depending on lunar calendar)"
    ],
    breaksAndLeaves: []
  },
  {
    month: "March",
    year: 2027,
    sessionEvents: [
      "Last Working Day for Classes VI to VIII",
      "Last Working Day for Nursery to Class V",
      "New Academic Session 2027-28 begins for Board Classes X & XII (Mid/Late March)",
      "Foundational Stage Final Oral & Checklists (Nur to UKG: Hindi, English, Math, EVS)"
    ],
    periodicTests: [],
    majorExams: [
      "Annual Examinations for Classes III to VIII (concluding)",
      "Answer Scripts showing to students (Classes III to V and VI to VIII)"
    ],
    ptms: [
      "PTM for Nursery to Class II",
      "Final Result Declarations / PTM for all Junior & Middle wings"
    ],
    holidaysAndFestivals: [
      "Maha Shivratri",
      "Eid-Al-Fitr",
      "Holika Dahan & Holi Festival",
      "Good Friday"
    ],
    breaksAndLeaves: [
      "Session-end transition break before commencement of next academic year"
    ]
  }
];

/**
 * Detailed text formatting helper to supply the complete academic calendar context to LLM models
 */
export function getFormattedAcademicCalendarPrompt(): string {
  let output = `--- DELHI PUBLIC SCHOOL INDIRAPURAM: ANNUAL ACADEMIC CALENDAR (2026-2027) ---\n`;
  output += `Official Source: https://www.dpsindirapuram.com/calendar/annual-academic-calendar.pdf\n\n`;

  for (const m of ANNUAL_ACADEMIC_CALENDAR) {
    output += `### ${m.month.toUpperCase()} ${m.year}\n`;
    if (m.sessionEvents.length) {
      output += `• Session Start & Milestones: ${m.sessionEvents.join("; ")}\n`;
    }
    if (m.periodicTests.length) {
      output += `• Periodic Tests (PT): ${m.periodicTests.join("; ")}\n`;
    }
    if (m.majorExams.length) {
      output += `• Major Examinations (Half Yearly / Pre-Board / Annual): ${m.majorExams.join("; ")}\n`;
    }
    if (m.ptms.length) {
      output += `• Parent-Teacher Meetings (PTMs) & Answer Scripts: ${m.ptms.join("; ")}\n`;
    }
    if (m.holidaysAndFestivals.length) {
      output += `• Holidays & Festivals: ${m.holidaysAndFestivals.join("; ")}\n`;
    }
    if (m.breaksAndLeaves.length) {
      output += `• Vacations & Leaves: ${m.breaksAndLeaves.join("; ")}\n`;
    }
    output += `\n`;
  }

  output += `\nKey Academic Rules & Guidelines:
1. Periodic Tests (PT): Held continuously throughout the year for continuous evaluation.
2. Pre-Boards (PB): Two full rounds of Pre-Board Examinations (PB-1 in Dec, PB-2 in Dec/Jan) are held for Class X & Class XII before CBSE Board Exams.
3. Mid-Term & Half Yearly: Held in June/July (Mid-Term for XII) and September (Half-Yearly for classes III to XII).
4. Annual Exams: Classes IX & XI exams take place in Jan-Feb; Classes III to VIII exams take place in Feb-March.
5. PTMs: Regularly organized following every major assessment cycle with answer script sharing for full transparency.
6. Summer & Winter Break: Summer vacation starts in late May and reopens in June (X & XII) and July (Nur-IX & XI). Winter break begins in late December and reopens in January.`;

  return output;
}
