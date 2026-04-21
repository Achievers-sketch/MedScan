import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Trash2, ExternalLink } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface Prediction {
  id: number;
  filename: string;
  prediction: string;
  confidence: number;
  timestamp: string;
}

export default function Dashboard() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Execute deletion protocol on this record?')) return;
    try {
      const res = await fetch(`/api/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center pt-20 text-blue-600 text-lg font-semibold animate-pulse">Accessing Database...</div>;

  // Chart Data Prep
  const classCount: Record<string, number> = {};
  history.forEach(item => {
    classCount[item.prediction] = (classCount[item.prediction] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(classCount),
    datasets: [
      {
        data: Object.values(classCount),
        backgroundColor: [
          '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: history.map(item => new Date(item.timestamp).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: 'Confidence Score (%)',
        data: history.map(item => item.confidence * 100).reverse(),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    color: '#334155',
    plugins: {
      legend: { labels: { color: '#334155', font: { family: 'inherit' } } }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { family: 'inherit' } }, grid: { color: 'rgba(226,232,240,1)' } },
      y: { ticks: { color: '#64748b', font: { family: 'inherit' } }, grid: { color: 'rgba(226,232,240,1)' } }
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex-1 grid grid-cols-12 gap-6">
        
        {/* Main Panel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Historical Analysis Records</h2>
              <span className="text-xs text-blue-600 font-medium">{history.length} records found</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((record) => (
                    <div key={record.id} className="p-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all cursor-pointer group flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-bold text-slate-800">{record.prediction}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${record.confidence > 0.8 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {(record.confidence * 100).toFixed(1)}% CONF
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">#{record.id.toString().padStart(4, '0')} • {new Date(record.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link to={`/result/${record.id}`} className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-sm">
                           <ExternalLink size={16} />
                         </Link>
                         <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors shadow-sm">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No scan records found in database.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Confidence Trends</h2>
             <div className="h-48">
               <Line data={lineData} options={{...chartOptions, maintainAspectRatio: false}} />
             </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Dataset Distribution</h2>
             <div className="h-64 flex justify-center">
               <Pie data={pieData} options={{ color: '#334155', plugins: { legend: { position: 'bottom', labels: { color: '#334155', font: { family: 'inherit' } } } } }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
