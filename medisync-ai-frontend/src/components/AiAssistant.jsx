import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  HelpCircle, 
  ShieldAlert, 
  RefreshCw,
  Share2,
  Printer,
  ChevronRight
} from 'lucide-react';
import { sendAiChatMessage, analyzeSymptoms } from '../services/api';

export default function AiAssistant({ patient, onBookSpecialist }) {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' or 'triage'
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${patient?.name || 'Alex'}, I'm your **MediSync AI Clinical Assistant**. I have reviewed your current medical profile (Blood: ${patient?.bloodGroup || 'O+'}, Allergy: ${patient?.allergies?.join(', ') || 'Penicillin'}).
      
How are you feeling today? You can ask me about symptoms, medications, lab values, or lifestyle adjustments.`,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Structured Triage state
  const [triageForm, setTriageForm] = useState({
    symptoms: '',
    duration: '1-2 days',
    severity: 'Moderate',
    triggers: ''
  });
  const [triageResult, setTriageResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeMode]);

  // Quick Prompt Prompts
  const quickPrompts = [
    "I have a throbbing headache & sensitivity to bright light",
    "Is it safe to take ibuprofen with my asthma condition?",
    "What should I do if my blood pressure spikes above 135?",
    "Tips to relieve nighttime cough and airway wheezing"
  ];

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const aiReply = await sendAiChatMessage(text, messages);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRunTriage = async (e) => {
    e.preventDefault();
    if (!triageForm.symptoms.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(
        triageForm.symptoms, 
        triageForm.duration, 
        triageForm.severity
      );
      setTriageResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[640px]">
      
      {/* Header & Mode Switcher */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">MediSync AI Clinical Intelligence</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Spring AI & Gemini
              </span>
            </div>
            <p className="text-xs text-slate-300">Continuous clinical decision support and triage analysis</p>
          </div>
        </div>

        {/* Tab switcher: Conversational vs Structured Triage */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl backdrop-blur-md border border-white/10 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'chat'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Conversational Triage
          </button>
          <button
            onClick={() => setActiveMode('triage')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'triage'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            Structured Symptom Form
          </button>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Clinical Note:</strong> MediSync AI provides AI-assisted triage insights based on clinical guidelines. Always consult a licensed physician for diagnosis.
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeMode === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[440px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white shadow-xs rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/70 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <div>{m.text}</div>
                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 border border-slate-200/70 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-sky-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">MediSync AI analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 sm:px-6 pt-2 pb-1 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Suggested Prompts:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 text-xs font-medium transition-all shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 pt-3 bg-white border-t border-slate-200/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask MediSync AI about symptoms, prescriptions, or vitals..."
                className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-50/60"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-2xl shadow-md shadow-sky-600/20 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Structured Triage Form Mode */
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="text-center max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-800">Comprehensive AI Symptom Triage</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your current physical symptoms to generate an instant clinical triage report with priority scoring.
              </p>
            </div>

            <form onSubmit={handleRunTriage} className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Describe Symptoms in Plain English *
                </label>
                <textarea
                  rows={3}
                  value={triageForm.symptoms}
                  onChange={(e) => setTriageForm({ ...triageForm, symptoms: e.target.value })}
                  placeholder="e.g. Sharp pain on the right side of my head with pulsating nausea and sensitivity to sunlight..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration</label>
                  <select
                    value={triageForm.duration}
                    onChange={(e) => setTriageForm({ ...triageForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Less than 6 hours">Less than 6 hours</option>
                    <option value="1-2 days">1 - 2 days</option>
                    <option value="3-7 days">3 - 7 days</option>
                    <option value="More than 2 weeks">Chronic (&gt; 2 weeks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Self-Assessed Severity</label>
                  <select
                    value={triageForm.severity}
                    onChange={(e) => setTriageForm({ ...triageForm, severity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Mild">Mild (Noticeable but does not impede tasks)</option>
                    <option value="Moderate">Moderate (Distracting, requires medication)</option>
                    <option value="High">Severe / Intense (Debilitating)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !triageForm.symptoms.trim()}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clinical Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Clinical Triage Report</span>
                  </>
                )}
              </button>
            </form>

            {/* Structured Report Card */}
            {triageResult && (
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="font-bold text-slate-900 text-sm">Clinical Triage Summary #{triageResult.triageId}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    triageResult.urgencyColor === 'rose'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {triageResult.urgencyLevel}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Probable Diagnostic Considerations:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {triageResult.probableConsiderations.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Action Protocol:</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                    {triageResult.clinicalNextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Recommended Specialist</span>
                    <p className="text-sm font-bold text-sky-950">{triageResult.recommendedSpecialist}</p>
                  </div>
                  <button
                    onClick={() => onBookSpecialist(triageResult.recommendedSpecialist)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Find & Book Specialist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Questions to Ask Your Doctor:</h4>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {triageResult.suggestedQuestionsForDoctor.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
