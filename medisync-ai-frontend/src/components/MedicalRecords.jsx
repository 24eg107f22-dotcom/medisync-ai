import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  Search, 
  FileCheck, 
  Activity, 
  Eye, 
  Plus
} from 'lucide-react';
import { uploadMedicalRecord } from '../services/api';

export default function MedicalRecords({ records, onRecordsUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Lab Blood Test',
    doctor: 'Dr. Elena Rostova',
    summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await uploadMedicalRecord(form);
      onRecordsUpdated();
      setShowUploadModal(false);
      setForm({ title: '', category: 'Lab Blood Test', doctor: 'Dr. Elena Rostova', summary: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Electronic Health Records (EHR) & Diagnostics
          </h2>
          <p className="text-xs text-slate-500">Secure digital medical documents, diagnostic imaging, and pathology lab results</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Lab Document</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search records by name, panel type, or doctor..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Records Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredRecords.map((r) => (
            <div 
              key={r.id}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {r.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      r.status.includes('Normal') 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.summary}</p>
                  
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>Date: <strong className="text-slate-600">{r.date}</strong></span>
                    <span>•</span>
                    <span>Doctor: <strong className="text-slate-600">{r.doctor}</strong></span>
                    <span>•</span>
                    <span>{r.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setPreviewRecord(r)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => alert(`Downloading ${r.title} encrypted clinical report...`)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Upload Medical Diagnostic Record</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Thyroid Function TSH Screening"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Lab Blood Test">Lab Blood Test</option>
                  <option value="Diagnostic Imaging">Diagnostic Imaging (MRI / X-Ray)</option>
                  <option value="Diagnostic Cardiology">Diagnostic Cardiology (ECG)</option>
                  <option value="Clinical Summary">Clinical Discharge Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Findings Summary</label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Brief note or key lab values..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Uploading...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-base">{previewRecord.title}</h3>
              </div>
              <button onClick={() => setPreviewRecord(null)} className="text-slate-400 p-1">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Record ID:</span>
                <span className="font-mono font-bold text-slate-800">{previewRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Diagnostic Category:</span>
                <span className="font-bold text-slate-800">{previewRecord.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinical Status:</span>
                <span className="font-bold text-emerald-700">{previewRecord.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorizing Physician:</span>
                <span className="font-bold text-slate-800">{previewRecord.doctor}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">Pathology / Findings Summary:</span>
                <p className="text-slate-700 leading-relaxed">{previewRecord.summary}</p>
              </div>
            </div>

            <button
              onClick={() => setPreviewRecord(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
