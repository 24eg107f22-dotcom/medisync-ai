import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Thermometer, 
  Wind, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { logVitals } from '../services/api';

export default function VitalsWidget({ vitals, onVitalsUpdated }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    heartRate: vitals?.heartRate?.value || 72,
    systolic: vitals?.bloodPressure?.systolic || 118,
    diastolic: vitals?.bloodPressure?.diastolic || 76,
    oxygenLevel: vitals?.oxygenLevel?.value || 99,
    bloodGlucose: vitals?.bloodGlucose?.value || 94,
    temperature: vitals?.temperature?.value || 98.4
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await logVitals(form);
      onVitalsUpdated(updated);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with quick action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            Biometric Vitals & Telemetry
          </h2>
          <p className="text-xs text-slate-500">Continuous clinical telemetry synced across IoT medical monitors</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 rounded-xl text-xs font-semibold transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Vitals</span>
        </button>
      </div>

      {/* Vitals Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Heart Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Heart Rate</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500 animate-pulse-heart" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {vitals?.heartRate?.value || 72}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{vitals?.heartRate?.unit || 'BPM'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Normal Sinus
            </span>
            <span className="text-slate-400">Resting</span>
          </div>
          {/* Mini pulse wave visualization */}
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Blood Pressure</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {vitals?.bloodPressure?.systolic || 118}/{vitals?.bloodPressure?.diastolic || 76}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{vitals?.bloodPressure?.unit || 'mmHg'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Optimal (AHA)
            </span>
            <span className="text-slate-400">Target &lt;120/80</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-teal-500 rounded-full w-4/5"></div>
          </div>
        </div>

        {/* SpO2 Oxygen */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Oxygen Sat (SpO2)</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {vitals?.oxygenLevel?.value || 99}
            </span>
            <span className="text-xs text-slate-400 font-semibold">%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-teal-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Excellent
            </span>
            <span className="text-slate-400">Normal &gt;95%</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full w-[99%]"></div>
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Blood Glucose</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {vitals?.bloodGlucose?.value || 94}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{vitals?.bloodGlucose?.unit || 'mg/dL'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Fasting Normal
            </span>
            <span className="text-slate-400">70-99</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Body Temperature */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Temperature</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {vitals?.temperature?.value || 98.4}
            </span>
            <span className="text-xs text-slate-400 font-semibold">°F</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-indigo-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Afebrile
            </span>
            <span className="text-slate-400">Normal 97-99</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-sky-500 rounded-full w-3/4"></div>
          </div>
        </div>

      </div>

      {/* Log Vitals Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                Record Fresh Health Vitals
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={form.heartRate}
                    onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 72"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={form.oxygenLevel}
                    onChange={(e) => setForm({ ...form, oxygenLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 98"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={form.systolic}
                    onChange={(e) => setForm({ ...form, systolic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={form.diastolic}
                    onChange={(e) => setForm({ ...form, diastolic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 80"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={form.bloodGlucose}
                    onChange={(e) => setForm({ ...form, bloodGlucose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 95"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 98.6"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing...' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
