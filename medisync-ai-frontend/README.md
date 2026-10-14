# 🏥 MediSync AI — Intelligent Healthcare & Clinical Assistant Frontend

A modern, responsive, healthcare-grade web application built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. 
Designed to seamlessly pair with your **Spring Boot 4.x (Java 17)** backend powered by **Spring AI & Google GenAI (Gemini)**.

---

## 🌟 Key Features

1. **🩺 Biometric Vitals & Telemetry Dashboard**
   - Real-time monitors for Heart Rate (BPM) with waveform pulse, Blood Pressure (mmHg), SpO2 Oxygen Saturation, Blood Glucose, and Body Temperature.
   - Interactive "+ Log Vitals" modal to record new biometric measurements with instant history update.

2. **🤖 AI Health Assistant & Clinical Symptom Triage (Spring AI + Gemini)**
   - Conversational AI medical chat with prompt suggestions.
   - Structured Symptom Triage Form: Calculates urgency level (Urgent / Routine), probable causes, home care guidelines, questions to ask your physician, and recommended medical specialty.
   - Built-in resilient fallback engine ensures the app works immediately out of the box even before your Spring Boot server is started.

3. **📅 Doctor Directory & Appointment Booking**
   - Filter specialists by department (Cardiology, Neurology, General Medicine, Orthopedics, Dermatology).
   - Real-time appointment booking with consultation format options (**Telehealth Video Call** vs **In-Clinic Visit**).
   - Instant confirmation tickets with appointment IDs and calendar sync.

4. **💊 Electronic Prescriptions & Pharmacy Sync**
   - Active medications, dosage instructions, remaining pill counts, and days-left indicators.
   - One-click "Request Refill" synced with local pharmacy.
   - Automatic AI Drug-Drug interaction safety check banner.

5. **📁 Electronic Health Records (EHR) & Diagnostics**
   - View pathology lab results (CMP, Lipid panels), ECG cardiology reports, and radiology scans.
   - Search records by keyword, download simulated clinical PDF reports, or upload new diagnostic documents.

6. **👨‍⚕️ Clinician & Doctor Portal (Dual Role)**
   - Seamlessly toggle between **Patient Portal** and **Clinician / Doctor View** in the top navigation bar.
   - Doctor's patient queue with triage urgency badges (Red = Urgent, Amber = Follow-up, Green = Routine).
   - Pre-consultation AI summary and interactive **SOAP Clinical Note Editor** (Subjective, Objective, Assessment, Plan).

7. **🚨 Emergency SOS Dispatch Protocol**
   - Glowing Emergency SOS button with 10-second countdown (cancelable for false alarms).
   - Displays nearest Emergency Trauma ER (distance and ETA), direct 911 / 112 hotlines, and broadcasts critical telemetry (blood group, allergies, ICE contacts).

8. **⚙️ Backend Connection Settings & Spring AI Bridge**
   - Live backend status indicator (**Spring Boot: Live** vs **Demo Mode**).
   - Configurable API URL (`http://localhost:8080/api`).
   - Built-in test connection probe and copy-paste ready Spring Boot Java code.

---

## 🚀 Getting Started

### 1. Development Mode
Run the development server with Hot Module Replacement (HMR):
```bash
npm install
npm run dev
```
Open your browser at: **`http://localhost:3000`** (or the port shown in your terminal).

### 2. Production Build
Build optimized production assets:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🔗 Spring Boot Backend Integration

The frontend looks for REST endpoints at `http://localhost:8080/api` by default. You can change this anytime via the **Backend Settings** modal (click the connection pill in the navbar).

### Expected Spring Boot REST Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning `{ "status": "UP" }` |
| `POST` | `/api/ai/chat` | Receives `{ message, history, patientContext }`, returns `{ reply }` |
| `POST` | `/api/ai/analyze-symptoms` | Receives `{ symptoms, duration, severity }`, returns structured triage report |
| `GET` | `/api/vitals` | Returns latest patient vitals and telemetry history |
| `POST` | `/api/vitals` | Saves a new vitals entry |
| `GET` | `/api/doctors` | Returns list of available doctors and slots |
| `GET` | `/api/appointments` | Returns scheduled appointments |
| `POST` | `/api/appointments` | Books a new appointment |
| `GET` | `/api/prescriptions` | Returns active prescriptions |
| `POST` | `/api/prescriptions/{id}/refill` | Requests pharmacy refill |
| `GET` | `/api/records` | Returns EHR records and lab reports |
| `POST` | `/api/records` | Uploads a new record |

---

## ☕ Sample Spring Boot Controller (Spring AI + Gemini)

Here is a ready-to-use Spring Boot controller to drop into your `com.medisync.medisync_ai` package:

```java
package com.medisync.medisync_ai.controller;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React frontend on port 3000
public class MediSyncApiController {

    @Autowired(required = false)
    private ChatModel chatModel;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "MediSync AI Backend");
    }

    @PostMapping("/ai/chat")
    public Map<String, String> chat(@RequestBody Map<String, Object> payload) {
        String userMessage = (String) payload.get("message");
        if (chatModel != null) {
            String aiResponse = chatModel.call(userMessage);
            return Map.of("reply", aiResponse);
        }
        return Map.of("reply", "Spring AI Echo: " + userMessage);
    }
}
```

---

## 📁 Project Structure

```
medisync-ai-frontend/
├── index.html                   # HTML template with Plus Jakarta Sans & MediSync meta
├── package.json                 # React 19, Vite 8, Tailwind CSS v4, Lucide Icons
├── vite.config.js               # Vite config with @tailwindcss/vite plugin
├── dist/                        # Ready-to-deploy production build
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application orchestrator & dashboard
    ├── App.css                  # Core layout styling
    ├── index.css                # Tailwind CSS v4 imports & animations
    ├── data/
    │   └── mockData.js          # Realistic clinical data (vitals, patients, doctors)
    ├── services/
    │   └── api.js               # Spring Boot REST bridge + intelligent fallback engine
    └── components/
        ├── Navbar.jsx           # Responsive header, role switcher & emergency trigger
        ├── VitalsWidget.jsx     # Live telemetry cards & vitals logging modal
        ├── AiAssistant.jsx      # Conversational AI triage & structured symptom checker
        ├── AppointmentBooking.jsx # Specialist filter & appointment booking modal
        ├── PrescriptionsList.jsx # Active medication management & refill requests
        ├── MedicalRecords.jsx   # EHR documents, lab reports & file viewer
        ├── DoctorPortal.jsx     # Clinician triage queue & AI SOAP note editor
        ├── EmergencyModal.jsx   # SOS countdown alert & paramedic dispatch card
        └── BackendSettingsModal.jsx # Backend URL config & Spring Boot Java code helper
```
