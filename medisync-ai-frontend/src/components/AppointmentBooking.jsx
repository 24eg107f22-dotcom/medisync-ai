import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Star, 
  ChevronRight, 
  CheckCircle2, 
  Filter, 
  User, 
  Stethoscope, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { bookAppointment } from '../services/api';

export default function AppointmentBooking({ 
  doctors, 
  appointments, 
  onAppointmentBooked,
  prefilteredSpecialty = null 
}) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(prefilteredSpecialty || 'All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [form, setForm] = useState({
    date: '2026-10-16',
    timeSlot: '10:00 AM',
    type: 'Telehealth Video Call',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = ['All', 'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'];

  const filteredDoctors = doctors.filter(doc => {
    if (selectedSpecialty === 'All') return true;
    return doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
  });

  const handleStartBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setForm(prev => ({
      ...prev,
      timeSlot: doctor.availableSlots[0]?.split(' ')[1] || '10:00 AM'
    }));
    setShowBookingModal(true);
    setBookingSuccess(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newBooking = await bookAppointment({
        doctorName: selectedDoctor.name,
        doctorAvatar: selectedDoctor.avatar,
        specialty: selectedDoctor.specialty,
        date: form.date,
        timeSlot: form.timeSlot,
        type: form.type,
        reason: form.reason || 'Routine Consultation'
      });
      onAppointmentBooked(newBooking);
      setBookingSuccess(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upcoming Appointments Section */}
      {appointments && appointments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            Your Scheduled Consultations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={apt.doctorAvatar} 
                        alt={apt.doctorName} 
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-2xs"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                        <p className="text-xs text-sky-600 font-semibold">{apt.specialty}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {apt.status}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50/80 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{apt.dateTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.type.includes('Video') ? (
                        <Video className="w-3.5 h-3.5 text-sky-500" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span>{apt.type} • {apt.location || 'Secure MediSync Telehealth Room'}</span>
                    </div>
                    {apt.reason && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        Reason: {apt.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">ID: {apt.id}</span>
                  {apt.type.includes('Video') ? (
                    <a
                      href={apt.roomLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Call</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : (
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors">
                      View Directions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Directory Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              Verified Clinical Specialists
            </h2>
            <p className="text-xs text-slate-500">Board-certified physicians available for in-person or instant telehealth</p>
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img 
                    src={doc.avatar} 
                    alt={doc.name} 
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.name}</h3>
                    <p className="text-xs text-teal-700 font-semibold">{doc.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating}
                      </span>
                      <span className="text-[11px] text-slate-400">({doc.reviewCount} reviews)</span>
                      <span className="text-[11px] text-slate-400">• {doc.experience}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {doc.about}
                </p>

                <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[150px]">{doc.hospital}</span>
                  </div>
                  <span className="font-bold text-slate-800">{doc.fee} / consult</span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Next: {doc.availableSlots[0] || 'Available this week'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleStartBooking(doc)}
                  className="w-full py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your appointment has been booked and synced into your medical calendar.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-slate-800">{bookingSuccess.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Specialist:</span>
                    <span className="font-bold text-slate-800">{bookingSuccess.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Time:</span>
                    <span className="font-bold text-slate-800">{bookingSuccess.dateTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Type:</span>
                    <span className="font-bold text-sky-700">{bookingSuccess.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedDoctor?.avatar} 
                      alt="" 
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Book with {selectedDoctor?.name}</h3>
                      <p className="text-xs text-teal-600 font-medium">{selectedDoctor?.specialty}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleConfirmBooking} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'Telehealth Video Call' })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          form.type === 'Telehealth Video Call'
                            ? 'bg-sky-50 border-sky-500 text-sky-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>Telehealth Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'In-Clinic Visit' })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          form.type === 'In-Clinic Visit'
                            ? 'bg-sky-50 border-sky-500 text-sky-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>In-Clinic Visit</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Select Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                      <select
                        value={form.timeSlot}
                        onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:15 PM">02:15 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Visit / Primary Symptoms
                    </label>
                    <textarea
                      rows={2}
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="e.g. Follow up on migraine episodes, review lab blood work..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Confirming...' : `Confirm (${selectedDoctor?.fee})`}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
