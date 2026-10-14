# 🏥 MediSync AI — Intelligent Healthcare & Clinical Assistant Ecosystem

MediSync AI is an end-to-end intelligent medical platform that bridges patient biometric telemetry, AI-assisted symptom triage powered by Google Gemini, electronic health records (EHR), specialist appointment scheduling, and an interactive clinician/doctor portal.

---

## 🏛️ Project Architecture

```
medisync-ai/
├── medisync-ai/                # ☕ Spring Boot Backend (Java 21, Spring AI, Google Gemini, MySQL, JPA, Spring Security)
│   ├── src/main/java/com/medisync/medisync_ai/
│   │   ├── MedisyncAiApplication.java
│   │   ├── config/SecurityConfig.java
│   │   └── controller/MediSyncApiController.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── medisync-ai-frontend/       # ⚛️ Modern Frontend (React 19, Vite, Tailwind CSS v4, Lucide Icons)
    ├── src/
    │   ├── components/         # VitalsWidget, AiAssistant, AppointmentBooking, DoctorPortal, EmergencyModal
    │   ├── services/api.js     # REST client & resilient offline fallback engine
    │   └── data/mockData.js
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start

### 1. Start Backend (Spring Boot 4 + MySQL)
Ensure MySQL is running on port `3306`:
```powershell
cd medisync-ai
.\mvnw.cmd spring-boot:run
```
The backend API starts at `http://localhost:8080/api`.

### 2. Start Frontend (React + Vite)
```powershell
cd medisync-ai-frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) and click **"Add New Project"**.
3. Select your repository and set the **Root Directory** to: `medisync-ai-frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy!

### Backend Deployment (Render / Railway / Cloud Run)
1. Connect your repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Set the **Root Directory** to `medisync-ai`.
3. Provision a managed MySQL database and link the environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `GEMINI_API_KEY`
4. Build Command: `./mvnw clean package -DskipTests`
5. Start Command: `java -jar target/*.jar`
