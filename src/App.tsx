import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { Activity, Clock, FileImage, LayoutDashboard, Info } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const baseClass = "px-4 py-2 rounded-md flex items-center gap-3 font-medium transition-colors";
    return location.pathname === path
      ? `${baseClass} bg-blue-50 text-blue-700`
      : `${baseClass} text-slate-500 hover:bg-slate-50`;
  };

  return (
    <nav className="flex-1 p-4 space-y-1">
      <Link to="/" className={getLinkClass("/")}>
        <Activity size={20} />
        Diagnostics
      </Link>
      <Link to="/upload" className={getLinkClass("/upload")}>
        <FileImage size={20} />
        New Scan
      </Link>
      <Link to="/dashboard" className={getLinkClass("/dashboard")}>
        <LayoutDashboard size={20} />
        Patient History
      </Link>
      <Link to="/about" className={getLinkClass("/about")}>
        <Info size={20} />
        Medical Reports
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 relative z-20">
          <div className="p-6 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              MedScan AI
            </Link>
          </div>
          
          <Navigation />
          
          <div className="p-4 mt-auto border-t border-slate-100">
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">AI Model Status</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> EfficientNet-B0 Ready
              </p>
            </div>
            <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest text-center">
              Not for medical diagnosis /// V1.1.0
            </p>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <h1 className="text-lg font-semibold text-slate-800">Analysis Dashboard</h1>
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Total Scans</span>
                <span className="text-sm font-bold text-slate-700">1,482</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Mean Accuracy</span>
                <span className="text-sm font-bold text-blue-600">94.2%</span>
              </div>
              <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                + New Scan
              </Link>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            <div className="h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}
