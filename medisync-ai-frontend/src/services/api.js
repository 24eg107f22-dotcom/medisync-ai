// MediSync AI API Client Service
// Seamlessly connects to Spring Boot backend at http://localhost:8080/api
// Automatically provides a resilient simulated engine with persistent localStorage fallback.

import {
  INITIAL_PATIENT,
  INITIAL_VITALS,
  DOCTORS_LIST,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_RECORDS,
  CLINICIAN_QUEUE
} from "../data/mockData";

const STORAGE_KEYS = {
  BASE_URL: "medisync_api_url",
  FORCE_MOCK: "medisync_force_mock",
  VITALS: "medisync_vitals",
  APPOINTMENTS: "medisync_appointments",
  PRESCRIPTIONS: "medisync_prescriptions",
  RECORDS: "medisync_records"
};

export const getApiBaseUrl = () => {
  return localStorage.getItem(STORAGE_KEYS.BASE_URL) || "http://localhost:8080/api";
};

export const setApiBaseUrl = (url) => {
  localStorage.setItem(STORAGE_KEYS.BASE_URL, url.replace(/\/$/, ""));
};

export const isForceMock = () => {
  return localStorage.getItem(STORAGE_KEYS.FORCE_MOCK) === "true";
};

export const setForceMock = (enabled) => {
  localStorage.setItem(STORAGE_KEYS.FORCE_MOCK, enabled ? "true" : "false");
};

// Internal fetch wrapper with timeout and fallback
async function request(endpoint, options = {}) {
  if (isForceMock()) {
    throw new Error("Force Mock Mode Enabled");
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 3500);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// -------------------------------------------------------------
// Live Status & Connectivity Check
// -------------------------------------------------------------
export async function checkBackendConnection() {
  if (isForceMock()) {
    return { connected: false, reason: "Demo / Mock Mode manually activated" };
  }
  try {
    const res = await request("/health", { timeout: 2000 });
    return { connected: true, details: res };
  } catch (err) {
    return {
      connected: false,
      reason: "Spring Boot backend at " + getApiBaseUrl() + " is offline or unreachable."
    };
  }
}

// -------------------------------------------------------------
// AI Chat & Symptom Analysis (Spring AI / Google GenAI Integration)
// -------------------------------------------------------------
export async function sendAiChatMessage(userMessage, conversationHistory = []) {
  try {
    const data = await request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        patientContext: INITIAL_PATIENT
      })
    });
    return data.reply || data.response || data.message;
  } catch (err) {
    // Intelligent medical AI simulation fallback
    return generateSimulatedAiResponse(userMessage);
  }
}

export async function analyzeSymptoms(symptoms, duration = "2 days", severity = "Moderate") {
  try {
    return await request("/ai/analyze-symptoms", {
      method: "POST",
      body: JSON.stringify({ symptoms, duration, severity })
    });
  } catch (err) {
    return generateSimulatedTriageReport(symptoms, duration, severity);
  }
}

// -------------------------------------------------------------
// Vitals Management
// -------------------------------------------------------------
export async function getVitals() {
  try {
    return await request("/vitals");
  } catch (err) {
    const saved = localStorage.getItem(STORAGE_KEYS.VITALS);
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  }
}

export async function logVitals(newReading) {
  try {
    return await request("/vitals", {
      method: "POST",
      body: JSON.stringify(newReading)
    });
  } catch (err) {
    const current = await getVitals();
    const updated = {
      ...current,
      heartRate: {
        ...current.heartRate,
        value: Number(newReading.heartRate) || current.heartRate.value,
        history: [...current.heartRate.history.slice(1), Number(newReading.heartRate) || current.heartRate.value]
      },
      bloodPressure: {
        ...current.bloodPressure,
        systolic: Number(newReading.systolic) || current.bloodPressure.systolic,
        diastolic: Number(newReading.diastolic) || current.bloodPressure.diastolic,
        status: Number(newReading.systolic) > 130 ? "Elevated" : "Optimal"
      },
      oxygenLevel: {
        ...current.oxygenLevel,
        value: Number(newReading.oxygenLevel) || current.oxygenLevel.value
      },
      bloodGlucose: {
        ...current.bloodGlucose,
        value: Number(newReading.bloodGlucose) || current.bloodGlucose.value
      },
      temperature: {
        ...current.temperature,
        value: Number(newReading.temperature) || current.temperature.value
      }
    };
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(updated));
    return updated;
  }
}

// -------------------------------------------------------------
// Doctor Directory & Appointments
// -------------------------------------------------------------
export async function getDoctors() {
  try {
    return await request("/doctors");
  } catch (err) {
    return DOCTORS_LIST;
  }
}

export async function getAppointments() {
  try {
    return await request("/appointments");
  } catch (err) {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  }
}

export async function bookAppointment(booking) {
  try {
    return await request("/appointments", {
      method: "POST",
      body: JSON.stringify(booking)
    });
  } catch (err) {
    const appointments = await getAppointments();
    const newEntry = {
      id: "APT-" + Math.floor(1000 + Math.random() * 9000),
      status: "Confirmed",
      dateTime: `${booking.date}, ${booking.timeSlot}`,
      doctorName: booking.doctorName,
      doctorAvatar: booking.doctorAvatar,
      specialty: booking.specialty,
      type: booking.type || "Telehealth Video Call",
      reason: booking.reason || "General Consultation",
      roomLink: "https://meet.medisync.ai/room-" + Math.floor(1000 + Math.random() * 9000)
    };
    const updated = [newEntry, ...appointments];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    return newEntry;
  }
}

// -------------------------------------------------------------
// Prescriptions
// -------------------------------------------------------------
export async function getPrescriptions() {
  try {
    return await request("/prescriptions");
  } catch (err) {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  }
}

export async function requestRefill(prescriptionId) {
  try {
    return await request(`/prescriptions/${prescriptionId}/refill`, {
      method: "POST"
    });
  } catch (err) {
    const list = await getPrescriptions();
    const updated = list.map((p) => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          status: "Refill Requested",
          badgeColor: "sky",
          daysLeft: p.daysLeft + 30
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(updated));
    return { success: true, message: "Refill requested with pharmacy" };
  }
}

// -------------------------------------------------------------
// Medical Records
// -------------------------------------------------------------
export async function getMedicalRecords() {
  try {
    return await request("/records");
  } catch (err) {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  }
}

export async function uploadMedicalRecord(record) {
  try {
    return await request("/records", {
      method: "POST",
      body: JSON.stringify(record)
    });
  } catch (err) {
    const records = await getMedicalRecords();
    const newRecord = {
      id: "REC-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Review Pending",
      fileSize: "1.2 MB PDF",
      ...record
    };
    const updated = [newRecord, ...records];
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
    return newRecord;
  }
}

// -------------------------------------------------------------
// Clinician / Doctor Queue & SOAP Notes
// -------------------------------------------------------------
export async function getClinicianQueue() {
  try {
    return await request("/doctor/queue");
  } catch (err) {
    return CLINICIAN_QUEUE;
  }
}

// -------------------------------------------------------------
// Intelligent Clinical AI Fallback Simulators
// -------------------------------------------------------------
function generateSimulatedAiResponse(input) {
  const query = input.toLowerCase();

  if (query.includes("headache") || query.includes("migraine")) {
    return `Hello Alex. I understand you're experiencing headache symptoms. 
    
**Clinical Assessment:**
1. **Hydration & Rest:** Tension headaches are frequently triggered by dehydration, eye fatigue, or screen glare. Ensure you drink 16-20 oz of water.
2. **Medication note:** Given your mild asthma history, avoid NSAIDs like aspirin or ibuprofen if they have ever triggered wheezing; acetaminophen (Tylenol) is generally considered a safer first-line alternative unless contraindicated.
3. **Red Flags:** Seek emergency evaluation if accompanied by sudden "thunderclap" onset, visual aura loss, high fever, or neck stiffness.

Would you like me to book a quick check with **Dr. Marcus Vance (Neurology)** or **Dr. Elena Rostova**?`;
  }

  if (query.includes("chest") || query.includes("heart") || query.includes("breathing") || query.includes("shortness")) {
    return `⚠️ **Immediate Medical Advisory:**
Chest tightness or acute shortness of breath requires careful clinical screening.

- If you feel pressure, squeezing in the center of the chest, pain spreading to your jaw or left shoulder, or dizziness, **please trigger the Emergency SOS button immediately or call 911 / 112**.
- Since you have a history of mild asthma, please check if using your prescribed **Albuterol inhaler (1-2 puffs)** relieves your airway bronchospasm.
- Check your SpO2 using your pulse oximeter. If saturation dips below 93%, seek urgent emergency care.`;
  }

  if (query.includes("blood pressure") || query.includes("bp") || query.includes("hypertension")) {
    return `Your baseline blood pressure is currently recorded at **118/76 mmHg**, which falls in the **Optimal / Normal range** according to American Heart Association guidelines (under 120/80 mmHg).

**Healthy BP Maintenance Tips:**
- Sodium intake target: Under 2,000 mg/day (DASH diet).
- 30 minutes of moderate aerobic activity (e.g. brisk walking) 5 days a week.
- Keep consistent sleep patterns (7-8 hours).

Would you like to log a fresh BP reading right now?`;
  }

  if (query.includes("diet") || query.includes("food") || query.includes("sugar") || query.includes("glucose")) {
    return `Your fasting blood glucose is **94 mg/dL**, well within the normal healthy fasting range (70–99 mg/dL).

**AI Nutritional Recommendations:**
- Prioritize high-fiber complex carbohydrates (oats, quinoa, legumes) over refined sugars to prevent glycemic spikes.
- Adequate hydration enhances renal clearance and metabolic equilibrium.
- Ensure healthy fats (avocados, extra virgin olive oil, walnuts) to support cardio-vascular health.`;
  }

  if (query.includes("appointment") || query.includes("book") || query.includes("doctor")) {
    return `I can help you coordinate an appointment! We have available slots with:
- **Dr. Elena Rostova** (General Medicine) — Today at 02:15 PM or Tomorrow 08:45 AM.
- **Dr. Sarah Jenkins** (Cardiology) — Tomorrow at 09:30 AM.
- **Dr. Marcus Vance** (Neurology) — Today at 04:30 PM.

Navigate to the **Appointments tab** to choose your preferred time and consultation mode (Telehealth video or In-Clinic).`;
  }

  return `Thank you for sharing, Alex. As your **MediSync AI Clinical Assistant**, I am monitoring your vitals and medical profile (O+, mild asthma, allergy to penicillin).

**Observations:**
- Your vitals are currently stable (Heart Rate: 72 BPM, SpO2: 99%, BP: 118/76 mmHg).
- Your Albuterol inhaler has 18 days of medication remaining.

Could you describe your symptoms in more detail (e.g., when they began, any fever, or triggers)? I can generate a structured triage summary for your physician.`;
}

function generateSimulatedTriageReport(symptoms, duration, severity) {
  const isUrgent =
    symptoms.toLowerCase().includes("chest") ||
    symptoms.toLowerCase().includes("faint") ||
    symptoms.toLowerCase().includes("breath") ||
    severity === "High";

  return {
    triageId: "TRG-" + Math.floor(10000 + Math.random() * 90000),
    timestamp: new Date().toISOString(),
    symptomsReported: symptoms,
    duration,
    urgencyLevel: isUrgent ? "High / Urgent Evaluation Recommended" : "Moderate / Schedule Routine Consultation",
    urgencyColor: isUrgent ? "rose" : "amber",
    probableConsiderations: isUrgent
      ? ["Cardiovascular strain / angina", "Acute bronchial exacerbation", "Costochondritis"]
      : ["Viral upper respiratory tract infection", "Tension fatigue or dehydration", "Mild seasonal allergic rhinitis"],
    clinicalNextSteps: [
      "Review vitals trends (SpO2 & Resting Pulse)",
      "Hydrate with electrolyte balance",
      "Avoid unverified over-the-counter NSAIDs due to allergy/asthma profile",
      isUrgent ? "Seek immediate urgent clinic evaluation if discomfort persists" : "Monitor symptoms for next 24-48 hours"
    ],
    recommendedSpecialist: isUrgent ? "Cardiologist or Emergency Medicine" : "General Internal Physician",
    suggestedQuestionsForDoctor: [
      "Could these symptoms be linked to my existing asthma profile?",
      "Are any diagnostic lab panels or imaging indicated?",
      "What trigger warning signs should prompt immediate emergency visit?"
    ]
  };
}
