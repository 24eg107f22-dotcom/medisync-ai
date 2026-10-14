import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  UserCheck, 
  Stethoscope, 
  Bell, 
  Settings, 
  Wifi, 
  WifiOff, 
  ChevronDown,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  backendStatus, 
  onOpenSettings, 
  onTriggerEmergency,
  activeTab,
  setActiveTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Prescription Refill Reminder: Omega-3 softgels due in 8 days", unread: true, time: "2h ago" },
    { id: 2, text: "Lab Results Ready: Comprehensive Metabolic Panel posted", unread: true, time: "1d ago" },
    { id: 3, text: "Telehealth checkup with Dr. Elena Rostova tomorrow at 8:45 AM", unread: false, time: "2d ago" }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 shadow-md shadow-sky-500/20 text-white">
              <HeartPulse className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-sky-900 to-teal-800 bg-clip-text text-transparent">
                  MediSync
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-sky-100 text-sky-700 border border-sky-200/60 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Intelligent Healthcare Ecosystem</p>
            </div>
          </div>

          {/* Navigation Links (Patient Role) */}
          {currentRole === 'patient' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/70">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Dashboard & Vitals
              </button>
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ai-assistant'
                    ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Triage & Chat
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'prescriptions'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Prescriptions
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'records'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                EHR Records
              </button>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentRole('patient')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'patient'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Patient View"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
              <button
                onClick={() => setCurrentRole('clinician')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'clinician'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Doctor / Clinician Portal"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinician</span>
              </button>
            </div>

            {/* Backend Connectivity Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                backendStatus.connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to configure Spring Boot connection"
            >
              {backendStatus.connected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Spring Boot: Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Mode</span>
                </>
              )}
              <Settings className="w-3 h-3 ml-0.5 opacity-60" />
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`py-2.5 px-2 text-xs rounded-lg transition-colors ${n.unread ? 'bg-sky-50/60 font-medium text-slate-800' : 'text-slate-600'}`}>
                        <p>{n.text}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={onTriggerEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-red-700 hover:shadow-lg transition-all animate-pulse"
              title="Emergency SOS Alert"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
