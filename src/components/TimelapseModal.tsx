import React, { useState, useEffect } from 'react';
import { X, Film, Download, Sparkles, Play, Pause } from 'lucide-react';

interface TimelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimelapseModal: React.FC<TimelapseModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDone, setRecordedDone] = useState(false);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 200);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const handleSimulateRecord = () => {
    setIsRecording(true);
    setRecordedDone(false);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedDone(true);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold">Rekam Video Reels Timelapse (1080×1920)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Frame */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-[400px] bg-slate-950 rounded-2xl border-2 border-purple-500/50 shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4">
            {/* Top Reel Banner */}
            <div className="w-full bg-slate-900/80 backdrop-blur px-3 py-2 rounded-xl text-center">
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Imagiive HQ Reels</div>
              <div className="text-xs font-bold text-white">Satu Hari Kerja AI</div>
            </div>

            {/* Center Animation Simulation */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center animate-spin">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-xs font-mono text-slate-300">
                {progress < 33 ? '08:00 - Pagi (Standup)' : progress < 66 ? '14:00 - Sore (Coding)' : '20:00 - Malam (Review)'}
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full space-y-1">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>00:00</span>
                <span>00:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-800 px-6 py-4 border-t border-slate-700 flex justify-between items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold text-white transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
          </button>

          <button
            onClick={handleSimulateRecord}
            disabled={isRecording}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white transition shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isRecording ? 'Merekam Frame...' : recordedDone ? 'Unduh MP4 Selesai!' : 'Mulai Rekam MP4'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
