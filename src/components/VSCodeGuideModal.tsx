import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Play, CheckCircle2, FileText } from 'lucide-react';

interface VSCodeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeGuideModal: React.FC<VSCodeGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">VS Code Setup & Execution Guide</h2>
              <p className="text-xs text-slate-300">PocketSmart AI: Fullstack React & Python FastAPI Instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Section A: Live Node/React Fullstack */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-900 font-semibold mb-2">
              <Play className="w-4 h-4 text-blue-600" />
              <span>Option A: Run Fullstack App (Node.js + Express + React + Gemini)</span>
            </div>
            <p className="text-xs text-blue-800 mb-3">
              This repository is pre-configured with Express, modern <code>@google/genai</code>, and Tailwind CSS.
            </p>
            <div className="space-y-2">
              <div className="relative bg-slate-900 text-slate-200 p-3 rounded-md font-mono text-xs">
                <code>npm install<br />npm run dev</code>
                <button
                  onClick={() => copyCode('npm install\nnpm run dev', 1)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                  title="Copy command"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Opens at <code>http://localhost:3000</code> with live Gemini AI reasoning.</p>
            </div>
          </div>

          {/* Section B: Python FastAPI Standalone Backend */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-semibold">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Option B: Run Standalone Python FastAPI Backend in VS Code</span>
            </div>
            <p className="text-xs text-slate-600">
              The project files matching the SmartBridge course specification are available in the <code>/python_backend</code> folder.
            </p>

            {/* Step 1 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">1</span>
                <span>Open VS Code & Navigate to Directory</span>
              </div>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>cd python_backend</code>
                <button
                  onClick={() => copyCode('cd python_backend', 2)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">2</span>
                <span>Create and Activate Virtual Environment</span>
              </div>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>python -m venv venv<br /># On Windows:<br />venv\Scripts\activate<br /># On macOS/Linux:<br />source venv/bin/activate</code>
                <button
                  onClick={() => copyCode('python -m venv venv && source venv/bin/activate', 3)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">3</span>
                <span>Install Dependencies</span>
              </div>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>pip install -r requirements.txt</code>
                <button
                  onClick={() => copyCode('pip install -r requirements.txt', 4)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 4 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">4</span>
                <span>Configure Environment Variables (.env)</span>
              </div>
              <p className="text-xs text-slate-500">Create a <code>.env</code> file inside <code>python_backend/</code> with:</p>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"<br />SECRET_KEY="supersecretjwtkeyforpocketsmartai"</code>
                <button
                  onClick={() => copyCode('GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"\nSECRET_KEY="supersecretjwtkeyforpocketsmartai"', 5)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 5 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">5</span>
                <span>Run the FastAPI Server</span>
              </div>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>uvicorn app:app --reload --port 8000</code>
                <button
                  onClick={() => copyCode('uvicorn app:app --reload --port 8000', 6)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 6 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Access the interactive Jinja2 UI at <code>http://localhost:8000</code> or API Swagger Docs at <code>http://localhost:8000/docs</code>.</p>
            </div>

            {/* Step 6 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px]">6</span>
                <span>Run Automated Test Script</span>
              </div>
              <div className="relative bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-xs">
                <code>python test_api.py</code>
                <button
                  onClick={() => copyCode('python test_api.py', 7)}
                  className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedIndex === 7 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Validates Gemini API connectivity, text/multimodal inference, and all 3 planner scenarios!</p>
            </div>
          </div>

          {/* Key Milestones Verified */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold text-xs text-slate-900 mb-2 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Verified Milestones from Documentation</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Milestone 1:</strong> Gemini AI initialization with multimodal text + image analysis.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Milestone 2 & 3:</strong> Modular backend routing (/generate-home, /generate-party, /generate-jewelry, /history).</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Milestone 4 & 5:</strong> Responsive card layouts, shopping link enrichments, and user session management.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-xl">
          <span className="text-xs text-slate-500">See <code>VS_CODE_SETUP_GUIDE.md</code> for full offline documentation.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
