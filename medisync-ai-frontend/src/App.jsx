import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VitalsWidget from './components/VitalsWidget';
import AiAssistant from './components/AiAssistant';
import AppointmentBooking from './components/AppointmentBooking';
import PrescriptionsList from './components/PrescriptionsList';
import MedicalRecords from './components/MedicalRecords';
import DoctorPortal from './components/DoctorPortal';
import EmergencyModal from './components/EmergencyModal';
import BackendSettingsModal from './components/BackendSettingsModal';

import {
  INITIAL_PATIENT,
  INITIAL_VITALS,
  DOCTORS_LIST,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_RECORDS
} from './data/mockData';

import {
  checkBackendConnection,
  getVitals,
  getDoctors,
  getAppointments,
  getPrescriptions,
  getMedicalRecords
} from './services/api';

import {
  Sparkles,
  HeartPulse,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  User,
  ShieldCheck,
  Phone,
  ChevronRight,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('patient'); // 'patient' or 'clinician'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'ai-assistant', 'appointments', 'prescriptions', 'records'

  // Application Data State
  const [patient, setPatient] = useState(INITIAL_PATIENT);
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [doctors, setDoctors] = useState(DOCTORS_LIST);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Modals
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Backend Connectivity
  const [backendStatus, setBackendStatus] = useState({ connected: false, checking: true });

  // Initial Load
  const loadAllData = async () => {
    try {
      const status = await checkBackendConnection();
      setBackendStatus({ ...status, checking: false });

      const [v, d, a, p, r] = await Promise.all([
        getVitals(),
        getDoctors(),
        getAppointments(),
        getPrescriptions(),
        getMedicalRecords()
      ]);

      setVitals(v);
      setDoctors(d);
      setAppointments(a);
      setPrescriptions(p);
      setRecords(r);
    } catch (err) {
      console.error("Data load error:", err);
      setBackendStatus({ connected: false, checking: false });
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleBookSpecialistFromAi = (specialty) => {
    setActiveTab('appointments');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        backendStatus={backendStatus}
        onOpenSettings={() => setShowSettingsModal(true)}
        onTriggerEmergency={() => setShowEmergencyModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Clinician Portal Mode */}
        {currentRole === 'clinician' ? (
          <DoctorPortal />
        ) : (
          /* Patient Portal Mode */
          <>
            {/* Patient Header Banner */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-md shadow-sky-500/15 shrink-0">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sky-700 font-black text-xl">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                    <span className="text-xs text-slate-400 font-mono">({patient.id})</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      Active Telemetry Sync
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span>{patient.age} yrs • {patient.gender}</span>
                    <span>•</span>
                    <span>Blood: <strong className="text-rose-600 font-bold">{patient.bloodGroup}</strong></span>
                    <span>•</span>
                    <span>Height: {patient.height}</span>
                    <span>•</span>
                    <span>Weight: {patient.weight}</span>
                  </div>
                </div>
              </div>

              {/* Patient Safety Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {patient.allergies.map((allergy, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/90 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Allergy: {allergy}
                  </span>
                ))}
                {patient.chronicConditions.map((cond, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    {cond}
                  </span>
                ))}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>ICE: {patient.emergencyContact.name}</span>
                </div>
              </div>
            </div>

            {/* Sub-View Navigation Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Vitals Telemetry Widget */}
                <VitalsWidget vitals={vitals} onVitalsUpdated={setVitals} />

                {/* AI Assistant Quick Banner Callout */}
                <div className="relative overflow-hidden bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="relative z-10 max-w-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-400/20 border border-teal-300/30 flex items-center justify-center text-teal-300">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                        MediSync AI Triage Engine
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">
                      Experience symptoms or have medical questions?
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Consult our Spring AI & Gemini clinical intelligence assistant for real-time symptom triage, emergency screening, and personalized care recommendations.
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('ai-assistant')}
                      className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer group"
                    >
                      <Sparkles className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                      <span>Launch AI Consultation</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Two Column Grid: Appointments Preview & Prescriptions Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Next Appointment Card */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-600" />
                          Upcoming Consultation
                        </h3>
                        <button
                          onClick={() => setActiveTab('appointments')}
                          className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                        >
                          <span>View all</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {appointments.length > 0 ? (
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={appointments[0].doctorAvatar} 
                                alt="" 
                                className="w-11 h-11 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{appointments[0].doctorName}</h4>
                                <p className="text-xs text-sky-600 font-semibold">{appointments[0].specialty}</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {appointments[0].status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/50">
                            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {appointments[0].dateTime}
                            </span>
                            <span className="text-slate-500">{appointments[0].type}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 py-4">No appointments scheduled.</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Schedule New Doctor Visit</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Active Prescriptions Overview */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                          <Pill className="w-4 h-4 text-sky-600" />
                          Medication Schedule
                        </h3>
                        <button
                          onClick={() => setActiveTab('prescriptions')}
                          className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                        >
                          <span>Manage Rx</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {prescriptions.slice(0, 2).map((rx) => (
                          <div key={rx.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-white border border-slate-200 text-sky-600">
                                <Pill className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{rx.medication}</h4>
                                <p className="text-[11px] text-slate-500">{rx.dosage}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rx.daysLeft <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {rx.daysLeft} days left
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="w-4 h-4" /> All prescriptions active
                      </span>
                      <button
                        onClick={() => setActiveTab('prescriptions')}
                        className="font-bold text-sky-600 hover:text-sky-700"
                      >
                        Request Pharmacy Refill →
                      </button>
                    </div>
                  </div>

                </div>

                {/* Recent Diagnostic Records Section */}
                <MedicalRecords records={records} onRecordsUpdated={loadAllData} />

              </div>
            )}

            {/* Individual Sub-Views */}
            {activeTab === 'ai-assistant' && (
              <AiAssistant 
                patient={patient} 
                onBookSpecialist={handleBookSpecialistFromAi} 
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentBooking
                doctors={doctors}
                appointments={appointments}
                onAppointmentBooked={(newBooking) => {
                  setAppointments([newBooking, ...appointments]);
                }}
              />
            )}

            {activeTab === 'prescriptions' && (
              <PrescriptionsList
                prescriptions={prescriptions}
                onPrescriptionsUpdated={loadAllData}
              />
            )}

            {activeTab === 'records' && (
              <MedicalRecords
                records={records}
                onRecordsUpdated={loadAllData}
              />
            )}

          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800">MediSync AI Platform</span>
            <span>• HIPAA & GDPR Security Compliant Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Spring Boot 4.1 & Spring AI</span>
            <span>•</span>
            <span>Google GenAI / Gemini 1.5 & 2.0</span>
            <span>•</span>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="text-sky-600 hover:underline font-semibold"
            >
              Backend API Config
            </button>
          </div>
        </div>
      </footer>

      {/* Emergency SOS Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        patient={patient}
      />

      {/* Backend Settings & Java Snippets Modal */}
      <BackendSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSettingsChanged={loadAllData}
      />

    </div>
  );
}
