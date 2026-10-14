import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Copy, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { 
  getApiBaseUrl, 
  setApiBaseUrl, 
  isForceMock, 
  setForceMock, 
  checkBackendConnection 
} from '../services/api';

export default function BackendSettingsModal({ isOpen, onClose, onSettingsChanged }) {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [forceMockMode, setForceMockMode] = useState(isForceMock());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(url);
    setForceMock(forceMockMode);
    onSettingsChanged();
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setApiBaseUrl(url);
    setForceMock(forceMockMode);
    try {
      const res = await checkBackendConnection();
      setTestResult(res);
    } catch (err) {
      setTestResult({ connected: false, reason: err.message });
    } finally {
      setTesting(false);
    }
  };

  const springBootSampleCode = `@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MediSyncApiController {

    @Autowired(required = false)
    private ChatModel chatModel; // Spring AI Google GenAI

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "MediSync AI Backend");
    }

    @PostMapping("/ai/chat")
    public Map<String, String> aiChat(@RequestBody Map<String, Object> payload) {
        String userMessage = (String) payload.get("message");
        if (chatModel != null) {
            String aiReply = chatModel.call(userMessage);
            return Map.of("reply", aiReply);
        }
        return Map.of("reply", "Spring AI response for: " + userMessage);
    }
}`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(springBootSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Backend Server Configuration</h2>
              <p className="text-xs text-slate-500">Configure connection to your Spring Boot REST backend</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Spring Boot API Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8080/api"
                className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs font-medium border flex items-start gap-2 ${
              testResult.connected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong>{testResult.connected ? 'Connected Successfully!' : 'Fallback Active:'}</strong>
                <p className="mt-0.5 opacity-90">{testResult.reason || 'Backend is reachable and responding.'}</p>
              </div>
            </div>
          )}

          {/* Force Mock Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Force Simulated Demo Mode</span>
              <span className="text-[11px] text-slate-500">
                Use built-in medical AI triage engine without connecting to Spring Boot.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={forceMockMode}
                onChange={(e) => setForceMockMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Toggle sample Spring Boot code */}
          <div className="pt-1">
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4" />
              <span>{showCode ? 'Hide Spring Boot Controller Sample' : 'View Spring Boot Java Integration Sample'}</span>
            </button>

            {showCode && (
              <div className="mt-2.5 relative">
                <button
                  onClick={copyCodeToClipboard}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Java'}</span>
                </button>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {springBootSampleCode}
                </pre>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="pt-3 flex gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
