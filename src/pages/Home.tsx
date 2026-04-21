import { Link } from 'react-router-dom';
import { ScanLine, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center -mt-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-3xl"
      >
        <div className="mb-6 relative inline-block">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <ScanLine size={40} className="text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 tracking-tight">
          MedScan Image Library & Classification
        </h2>
        
        <p className="text-base mb-8 text-slate-500 leading-relaxed max-w-2xl mx-auto">
          Automated anomaly detection protocol. Utilizing neural network pathways to analyze and fragment epidermal structural anomalies. 
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/upload" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Cpu size={18} />
            Start New Scan
          </Link>
          <Link 
            to="/about" 
            className="bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <ShieldAlert size={18} />
            System Specs
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
