import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Sparkles, 
  Pill, 
  ChevronRight, 
  Activity,
  Send,
  Check
} from 'lucide-react';
import { CLINICIAN_QUEUE } from '../data/mockData';

export default function DoctorPortal() {
  const [queue, setQueue] = useState(CLINICIAN_QUEUE);
  const [selectedPatient, setSelectedPatient] = useState(CLINICIAN_QUEUE[0]);
  const [soapNotes, setSoapNotes] = useState({
    subjective: "Patient presented with intermittent throbbing head pressure triggered by screen fatigue and dehydration.",
    objective: "BP 118/76 mmHg, HR 72 BPM regular, cranial nerves intact.",
    assessment: "Tension-type Cephalea secondary to digital eye strain and mild dehydration. Allergy profile verified (Penicillin contraindication).",
    plan: "Hydration re-equilibrium (2L/day). Prescribed Acetaminophen 500mg PRN. Advised ergonomic 20-20-20 visual rest intervals."
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setIsSaved(false);
    setSoapNotes({
      subjective: `Patient reports: ${patient.reason}. AI Triage notes: ${patient.aiSummary}`,
      objective: `Telemetry on record: ${patient.vitals}. Afebrile.`,
      assessment: `Clinical evaluation pending based on ${patient.triageLevel} triage flag.`,
      plan: `Order diagnostic review and update treatment regimen.`
    });
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCompleteEncounter = (id) => {
    setQueue(prev => prev.filter(p => p.id !== id));
    if (selectedPatient?.id === id) {
      setSelectedPatient(queue.find(p => p.id !== id) || null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Clinician Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Clinician Diagnostic Console</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Doctor View
                </span>
              </div>
              <p className="text-xs text-slate-300">Logged in as Dr. Elena Rostova, MD • Internal & Primary Medicine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Today's Queue</span>
              <span className="text-base font-extrabold text-white">{queue.length} Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Patient Encounter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patient Queue List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Patient Triage Queue
            </h3>
            <span className="text-xs text-slate-400">{queue.length} active</span>
          </div>

          <div className="space-y-2.5">
            {queue.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPatient?.id === patient.id
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                    <span className="text-xs text-slate-400">({patient.age}y, {patient.gender[0]})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    patient.triageLevel === 'Urgent'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : patient.triageLevel === 'Follow-up'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {patient.triageLevel}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Scheduled: {patient.time}</span>
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  {patient.reason}
                </p>

                <div className="mt-2 text-[11px] font-mono text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded-md inline-block">
                  {patient.vitals}
                </div>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No more patients in today's triage queue!
              </div>
            )}
          </div>
        </div>

        {/* Selected Patient Clinical Details & AI SOAP Notes */}
        {selectedPatient ? (
          <div className="lg:col-span-2 space-y-4">
            
            {/* AI Clinical Summary Banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    MediSync AI Pre-Consultation Summary
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">{selectedPatient.vitals}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedPatient.aiSummary}
              </p>
            </div>

            {/* SOAP Note Form */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Clinical Encounter Note (SOAP format) — {selectedPatient.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleCompleteEncounter(selectedPatient.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Conclude Encounter</span>
                </button>
              </div>

              <form onSubmit={handleSaveNotes} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    S — Subjective (Patient Chief Complaints & History)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.subjective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    O — Objective (Physical Exam & Telemetry Findings)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.objective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    A — Assessment (Clinical Diagnosis & Differential)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.assessment}
                    onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    P — Plan (E-Prescriptions, Diagnostics & Follow-up)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.plan}
                    onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {isSaved ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Note synced into patient EHR!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save & Sign SOAP Note
                  </button>
                </div>
              </form>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            Select a patient from the queue to view AI triage notes and document clinical encounter.
          </div>
        )}

      </div>
    </div>
  );
}
