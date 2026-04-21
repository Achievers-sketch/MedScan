import { Cpu, Server, Database, BrainCircuit, AlertTriangle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-2 pb-12">
      <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">System Specifications</h2>
      
      <div className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3 tracking-tight">
            <Cpu className="text-blue-600" /> Core Architecture
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            MedScan AI is constructed on a simulated EfficientNet-B0 neural network backbone designed for the HAM10000 dataset. To ensure rapid execution within this preview environment, classification processes route securely to Gemini 3.1 Pro via the @google/genai protocol. 
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
            <BrainCircuit className="text-blue-600" /> Classification Nodes
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium text-slate-700">
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C1</span>
              Melanoma
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C2</span>
              Nevus
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C3</span>
              Basal Cell Carcinoma
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C4</span>
              Actinic Keratosis
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C5</span>
              Benign Keratosis
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C6</span>
              Dermatofibroma
            </li>
            <li className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">C7</span>
              Vascular Lesion
            </li>
          </ul>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
              <Server size={18} className="text-blue-600" /> Data Management
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              All scans and prediction matrices are securely stored in a local SQLite node via Express/Node.js interconnects. No external databases are engaged.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
              <Database size={18} className="text-blue-600" /> Grad-CAM Integration
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Heatmap overlays are simulated utilizing deep CSS rendering engines to highlight anomalous pigment clusters on the epidermal layer.
            </p>
          </div>
        </section>

        <section className="p-6 bg-red-50 border border-red-100 rounded-2xl mt-8">
          <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2 tracking-tight">
            <AlertTriangle /> Critical Warning 
          </h3>
          <p className="text-sm text-red-800 opacity-90 leading-relaxed font-bold">
            MEDSCAN AI IS A SIMULATED ENVIRONMENT INTENDED FOR EDUCATIONAL, CS50, OR DEMONSTRATION PURPOSES. IT IS STRICTLY FORBIDDEN TO USE THIS SYSTEM FOR ACTUAL MEDICAL DIAGNOSIS. SEEK A LICENSED PROFESSIONAL.
          </p>
        </section>

      </div>
    </div>
  );
}
