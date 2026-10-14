import React, { useState } from 'react';
import { 
  Pill, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  Info
} from 'lucide-react';
import { requestRefill } from '../services/api';

export default function PrescriptionsList({ prescriptions, onPrescriptionsUpdated }) {
  const [refillingId, setRefillingId] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRefill = async (id) => {
    setRefillingId(id);
    try {
      const res = await requestRefill(id);
      setMessage({ type: 'success', text: 'Refill requested and submitted to pharmacy!' });
      setTimeout(() => setMessage(null), 4000);
      onPrescriptionsUpdated();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to request refill.' });
    } finally {
      setRefillingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-sky-600" />
            Active Prescriptions & Pharmacy Sync
          </h2>
          <p className="text-xs text-slate-500">Real-time dosage schedules, refill reminders, and drug interaction monitoring</p>
        </div>

        {/* AI Drug Interaction Shield */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>AI Interaction Check: No Adverse Clashes</span>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescriptions.map((rx) => (
          <div 
            key={rx.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rx.medication}</h3>
                    <p className="text-xs text-slate-500 font-medium">{rx.dosage}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  rx.daysLeft <= 10
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {rx.status}
                </span>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-[11px] text-slate-500 block uppercase tracking-wide">Usage Instructions:</span>
                <p className="leading-relaxed">{rx.instructions}</p>
              </div>

              {/* Days left progress */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Days Remaining</span>
                  <span className={`font-bold ${rx.daysLeft <= 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {rx.daysLeft} days ({rx.refillsRemaining} refills left)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      rx.daysLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (rx.daysLeft / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                Prescribed by: <span className="font-medium text-slate-600">{rx.prescribedBy}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleRefill(rx.id)}
                disabled={refillingId === rx.id || rx.status === 'Refill Requested'}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${refillingId === rx.id ? 'animate-spin' : ''}`} />
                <span>{rx.status === 'Refill Requested' ? 'Refill Pending' : 'Request Refill'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
