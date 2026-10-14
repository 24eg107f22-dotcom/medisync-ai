// Mock Data for MediSync AI

export const INITIAL_PATIENT = {
  id: "PID-89210",
  name: "Alex Morgan",
  age: 34,
  gender: "Female",
  bloodGroup: "O+",
  height: "168 cm",
  weight: "62 kg",
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Mild Asthma"],
  emergencyContact: {
    name: "David Morgan (Spouse)",
    phone: "+1 (555) 234-5678",
    relation: "Spouse"
  }
};

export const INITIAL_VITALS = {
  heartRate: {
    value: 72,
    unit: "BPM",
    status: "Normal",
    history: [68, 70, 75, 72, 74, 71, 72],
    trend: "+2% vs yesterday"
  },
  bloodPressure: {
    systolic: 118,
    diastolic: 76,
    unit: "mmHg",
    status: "Optimal",
    history: [
      { day: "Mon", sys: 120, dia: 78 },
      { day: "Tue", sys: 119, dia: 77 },
      { day: "Wed", sys: 122, dia: 80 },
      { day: "Thu", sys: 118, dia: 76 },
      { day: "Fri", sys: 116, dia: 75 },
      { day: "Sat", sys: 119, dia: 78 },
      { day: "Sun", sys: 118, dia: 76 },
    ],
    trend: "Stable"
  },
  oxygenLevel: {
    value: 99,
    unit: "% SpO2",
    status: "Excellent",
    trend: "Normal"
  },
  bloodGlucose: {
    value: 94,
    unit: "mg/dL",
    status: "Fasting Normal",
    trend: "Within target range"
  },
  temperature: {
    value: 98.4,
    unit: "°F",
    status: "Normal",
    trend: "No fever"
  }
};

export const DOCTORS_LIST = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins, MD",
    specialty: "Cardiology",
    department: "Cardiovascular Health",
    experience: "14 years",
    rating: 4.9,
    reviewCount: 142,
    hospital: "MediSync Central Hospital",
    fee: "$75",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    availableSlots: ["Tomorrow 09:30 AM", "Tomorrow 02:00 PM", "Thu 11:15 AM"],
    about: "Specializes in preventative cardiology, hypertension management, and heart rhythm disorders."
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Vance, DO",
    specialty: "Neurology",
    department: "Neuroscience Center",
    experience: "11 years",
    rating: 4.8,
    reviewCount: 98,
    hospital: "Metro Health Pavilion",
    fee: "$90",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    availableSlots: ["Today 04:30 PM", "Tomorrow 10:00 AM", "Fri 03:00 PM"],
    about: "Expert in chronic migraines, cognitive health, sleep disorders, and peripheral neuropathy."
  },
  {
    id: "doc-3",
    name: "Dr. Elena Rostova, MD",
    specialty: "General Medicine",
    department: "Internal Medicine",
    experience: "9 years",
    rating: 4.95,
    reviewCount: 215,
    hospital: "MediSync Urgent & Primary Care",
    fee: "$50",
    avatar: "https://images.unsplash.com/photo-1594824813512-259163273e34?auto=format&fit=crop&q=80&w=300",
    availableSlots: ["Today 02:15 PM", "Tomorrow 08:45 AM", "Tomorrow 01:30 PM"],
    about: "Dedicated primary physician offering comprehensive health reviews, acute infection care, and preventative wellness."
  },
  {
    id: "doc-4",
    name: "Dr. Robert Chen, MD",
    specialty: "Orthopedics",
    department: "Bone & Joint Clinic",
    experience: "16 years",
    rating: 4.7,
    reviewCount: 110,
    hospital: "Orthopedic Institute of Health",
    fee: "$85",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    availableSlots: ["Thu 10:30 AM", "Fri 11:45 AM", "Mon 09:00 AM"],
    about: "Focused on sports injuries, arthritic joint preservation, spine health, and post-op physical rehabilitation."
  },
  {
    id: "doc-5",
    name: "Dr. Amara Patel, MD",
    specialty: "Dermatology",
    department: "Skin & Allergy Care",
    experience: "8 years",
    rating: 4.88,
    reviewCount: 84,
    hospital: "Advanced Dermatology Center",
    fee: "$65",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    availableSlots: ["Tomorrow 03:15 PM", "Fri 09:30 AM", "Sat 10:00 AM"],
    about: "Clinical expert in allergic eczema, psoriasis, acne management, and digital dermatoscopy."
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-1049",
    doctorName: "Dr. Elena Rostova, MD",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813512-259163273e34?auto=format&fit=crop&q=80&w=300",
    specialty: "General Medicine",
    dateTime: "Tomorrow, 08:45 AM",
    type: "Telehealth Video Call",
    status: "Confirmed",
    roomLink: "https://meet.medisync.ai/room-1049",
    reason: "Quarterly Routine Health Checkup & Lab Review"
  },
  {
    id: "APT-1032",
    doctorName: "Dr. Sarah Jenkins, MD",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    specialty: "Cardiology",
    dateTime: "Next Tuesday, 02:00 PM",
    type: "In-Clinic Visit",
    status: "Upcoming",
    location: "Suite 402, MediSync Central Hospital",
    reason: "Resting ECG and preventative cardiovascular evaluation"
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "RX-4481",
    medication: "Albuterol HFA Inhaler",
    dosage: "90 mcg/actuation",
    instructions: "1-2 puffs every 4-6 hours as needed for wheezing or shortness of breath",
    prescribedBy: "Dr. Elena Rostova",
    daysLeft: 18,
    refillsRemaining: 2,
    status: "Active",
    badgeColor: "emerald"
  },
  {
    id: "RX-3920",
    medication: "Omega-3 Ethyl Esters",
    dosage: "1000 mg softgel",
    instructions: "Take 1 softgel daily with breakfast for lipid maintenance",
    prescribedBy: "Dr. Sarah Jenkins",
    daysLeft: 8,
    refillsRemaining: 1,
    status: "Refill Due Soon",
    badgeColor: "amber"
  },
  {
    id: "RX-2810",
    medication: "Vitamin D3 (Cholecalciferol)",
    dosage: "2000 IU",
    instructions: "Take 1 capsule every morning with food",
    prescribedBy: "Dr. Elena Rostova",
    daysLeft: 45,
    refillsRemaining: 3,
    status: "Active",
    badgeColor: "emerald"
  }
];

export const INITIAL_RECORDS = [
  {
    id: "REC-901",
    title: "Comprehensive Metabolic Panel (CMP)",
    date: "Oct 10, 2026",
    category: "Lab Blood Test",
    doctor: "Dr. Elena Rostova",
    status: "Normal",
    summary: "Kidney, liver, electrolyte, and fasting glucose metrics all within optimal baseline.",
    fileSize: "1.4 MB PDF"
  },
  {
    id: "REC-884",
    title: "12-Lead Electrocardiogram (ECG)",
    date: "Sep 28, 2026",
    category: "Diagnostic Cardiology",
    doctor: "Dr. Sarah Jenkins",
    status: "Normal Sinus Rhythm",
    summary: "Heart rate 71 BPM, PR interval 150ms, QTc 410ms. No ST-segment abnormalities noted.",
    fileSize: "2.1 MB PDF"
  },
  {
    id: "REC-812",
    title: "Lipid Panel & Cholesterol Screening",
    date: "Aug 15, 2026",
    category: "Lab Blood Test",
    doctor: "Dr. Elena Rostova",
    status: "Borderline High HDL",
    summary: "Total Cholesterol 185 mg/dL, HDL 64 mg/dL (Great), LDL 102 mg/dL, Triglycerides 95 mg/dL.",
    fileSize: "980 KB PDF"
  }
];

export const CLINICIAN_QUEUE = [
  {
    id: "P-101",
    name: "Alex Morgan",
    age: 34,
    gender: "Female",
    time: "08:45 AM",
    triageLevel: "Routine",
    triageColor: "emerald",
    reason: "Quarterly Routine Checkup & Medication Refill",
    aiSummary: "Patient reports stable asthma with minimal inhaler usage. Blood pressure 118/76 mmHg. No acute distress.",
    vitals: "BP: 118/76 | HR: 72 | SpO2: 99%"
  },
  {
    id: "P-102",
    name: "Jonathan Wright",
    age: 58,
    gender: "Male",
    time: "09:30 AM",
    triageLevel: "Urgent",
    triageColor: "rose",
    reason: "Acute Subacute Chest Discomfort & Shortness of Breath on Exertion",
    aiSummary: "AI Triage flagged high priority: Patient reported retrosternal ache radiating to left shoulder past 3 hours. Needs immediate ECG & troponin screening.",
    vitals: "BP: 148/92 | HR: 98 | SpO2: 94%"
  },
  {
    id: "P-103",
    name: "Maya Lin",
    age: 26,
    gender: "Female",
    time: "10:15 AM",
    triageLevel: "Follow-up",
    triageColor: "amber",
    reason: "Post-Allergic Dermatitis Recheck",
    aiSummary: "Completed 7-day topical hydrocortisone regimen. Skin rash reduced by 85%. Requesting maintenance skincare clearance.",
    vitals: "BP: 112/70 | HR: 68 | SpO2: 99%"
  }
];
