import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileImage, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/result/${data.id}`);
      } else {
        alert(data.error || 'Processing failed.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to backend.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Image Acquisition</h2>
      
      <div 
        className={`bg-white rounded-2xl shadow-sm border p-12 text-center transition-colors cursor-pointer relative overflow-hidden group flex-1 flex flex-col justify-center items-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerSelect}
      >
        <input 
          type="file" 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp" 
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
          }}
        />
        
        {previewUrl ? (
          <div className="relative z-10 flex flex-col items-center">
            <img src={previewUrl} alt="Preview" className="max-h-64 object-contain rounded-xl border border-slate-200 mb-4 shadow-sm" />
            <p className="font-semibold text-slate-700">{file?.name}</p>
            <p className="text-sm text-slate-400 mt-1">Click or drag to replace.</p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center py-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 group-hover:-translate-y-2 transition-transform">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Drag & Drop Image Map</h3>
            <p className="text-slate-500 text-sm">Or click to select binary image (JPG/PNG)</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSubmit} 
          disabled={!file || isProcessing}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {isProcessing ? (
            <>
              <Cpu size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileImage size={18} />
              Initialize Scan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
