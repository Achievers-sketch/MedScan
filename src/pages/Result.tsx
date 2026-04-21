import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, DatabaseBackup, ActivitySquare } from 'lucide-react';
import { motion } from 'motion/react';

interface Prediction {
  id: number;
  filename: string;
  prediction: string;
  confidence: number;
  heatmap_path: string;
  timestamp: string;
  explanation?: string;
}

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    fetch(`/api/result/${id}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center pt-20 text-blue-600 text-lg font-semibold animate-pulse">Extracting Data...</div>;
  }

  if (!data) {
    return <div className="text-center pt-20 text-red-600 text-lg font-semibold">Error 404: Data Not Found</div>;
  }

  const confidencePct = (data.confidence * 100).toFixed(1);
  const imageUrl = `/uploads/${data.filename}`;

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Current Analysis: ID-{data.id.toString().padStart(4, '0')}</h2>
            <p className="text-xs text-slate-500">Scanned on {new Date(data.timestamp).toLocaleDateString()}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${data.confidence > 0.8 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {data.confidence > 0.8 ? 'Immediate Follow-up Recommended' : 'Low Risk / Normal'}
          </div>
        </div>
        
        <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Heatmap View */}
          <div className="relative w-full md:w-1/2 aspect-square bg-slate-200 rounded-xl overflow-hidden group border border-slate-300 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-800 opacity-10"></div>
            <img 
              src={imageUrl} 
              alt="Uploaded scan" 
              className="max-w-full max-h-full object-contain relative z-10"
            />
            {/* Simulated Heatmap Overlay */}
            {showHeatmap && (
              <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply bg-gradient-to-tr from-blue-500 via-yellow-400 to-red-600 rounded-full scale-[0.4] blur-2xl translate-x-4 -translate-y-2 z-20"></div>
            )}

            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 transition-colors px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest z-30 isolate"
            >
              {showHeatmap ? 'Hide Grad-CAM' : 'Show Grad-CAM'}
            </button>
          </div>

          {/* Diagnostic Metrics */}
          <div className="flex-1 space-y-4 w-full">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Classification Result</p>
              <p className="text-2xl font-bold text-slate-900">{data.prediction}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: confidencePct + '%' }}></div>
                </div>
                <span className="text-sm font-bold text-blue-600">{confidencePct}%</span>
              </div>
            </div>

            {data.explanation && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-tight">Explainability Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.explanation}
                </p>
              </div>
            )}
            
            <div className="pt-6 flex gap-4">
               <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full">
                 <DatabaseBackup size={18} /> View History
               </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-red-50 border-t border-red-100">
          <p className="text-[10px] text-red-600 font-bold uppercase flex items-center gap-2 mb-1">
            <ShieldAlert className="w-3 h-3" />
            Medical Disclaimer
          </p>
          <p className="text-[10px] text-red-800 leading-tight opacity-75">
            THIS TOOL DOES NOT PROVIDE A MEDICAL DIAGNOSIS. Results are for clinical decision support for qualified professionals only. Seek a physician's advice for any suspicious skin lesions.
          </p>
        </div>
      </div>
    </div>
  );
}
