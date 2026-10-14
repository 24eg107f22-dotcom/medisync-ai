import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  User, 
  Heart, 
  X, 
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, patient }) {
  const [countdown, setCountdown] = useState(10);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      setIsDispatched(false);
      return;
    }

    if (countdown > 0 && !isDispatched) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isDispatched) {
      setIsDispatched(true);
    }
  }, [isOpen, countdown, isDispatched]);

  if (!isOpen) return null;

  const handleInstantDispatch = () => {
    setCountdown(0);
    setIsDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border-2 border-red-500 overflow-hidden relative">
        
        {/* Top Warning Banner */}
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-1.5 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency SOS Dispatch Protocol Activated</span>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <h2 className="text-lg font-black text-slate-900">Emergency Medical Assistance</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isDispatched ? (
            <div className="mt-4 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-500 text-red-600 flex items-center justify-center mx-auto text-3xl font-black shadow-lg animate-pulse">
                {countdown}
              </div>
              <p className="text-xs text-slate-600">
                Dispatching emergency telemetry to EMS and notifying emergency contact in <strong>{countdown} seconds</strong>.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="w-1/2 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancel (False Alarm)
                </button>
                <button
                  onClick={handleInstantDispatch}
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-red-600/30"
                >
                  Dispatch Right Now
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0" />
                <div className="text-xs">
                  <strong className="text-red-900 block font-bold">EMS Dispatch Signal Broadcasted!</strong>
                  <span className="text-red-700">Paramedic dispatch unit #402 en route to your registered telemetry location.</span>
                </div>
              </div>

              {/* Nearest ER Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-sky-600" />
                    Nearest Emergency Department:
                  </span>
                  <span className="text-emerald-700">ETA: 4 mins (1.8 miles)</span>
                </div>
                <p className="text-slate-600 font-medium">MediSync Central Trauma Hospital & ER</p>
                <p className="text-slate-400">450 Wellness Blvd, Medical Center Wing</p>
              </div>

              {/* Patient Emergency Profile */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-700 mb-1">Broadcasting Critical Telemetry:</div>
                <div className="flex justify-between text-slate-600">
                  <span>Patient Name:</span>
                  <strong className="text-slate-900">{patient?.name || 'Alex Morgan'}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Blood Group:</span>
                  <strong className="text-red-600">{patient?.bloodGroup || 'O+'}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Known Allergies:</span>
                  <strong className="text-amber-700">{patient?.allergies?.join(', ') || 'Penicillin'}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Emergency Contact:</span>
                  <strong className="text-slate-900">{patient?.emergencyContact?.name} ({patient?.emergencyContact?.phone})</strong>
                </div>
              </div>

              {/* Direct Calling Hotline buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href="tel:911"
                  className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 911 (USA)</span>
                </a>
                <a
                  href="tel:112"
                  className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 112 (Global)</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Dismiss Emergency Dialog
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
