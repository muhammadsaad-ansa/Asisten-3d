import React, { useState } from 'react';
import { OfficeStyle } from '../types';
import { GAYA_DAFTAR } from '../gaya/daftar';
import { Clock, Play, Pause, Sparkles, Building2, HelpCircle, Film, RefreshCw } from 'lucide-react';

interface HeaderProps {
  selectedStyle: OfficeStyle;
  onSelectStyle: (style: OfficeStyle) => void;
  currentTime: string;
  onTimeChange: (time: string) => void;
  timelapseActive: boolean;
  onToggleTimelapse: () => void;
  onOpenMissionBoard: () => void;
  onOpenTimelapseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedStyle,
  onSelectStyle,
  currentTime,
  onTimeChange,
  timelapseActive,
  onToggleTimelapse,
  onOpenMissionBoard,
  onOpenTimelapseModal,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            Kantor AI 3D <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">Imagiive HQ</span>
          </h1>
          <p className="text-xs text-slate-400">Kantor isometrik 3D untuk agen AI otonom kamu</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Style Selector */}
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">Gaya 3D:</span>
          <select
            value={selectedStyle}
            onChange={(e) => onSelectStyle(e.target.value as OfficeStyle)}
            className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {GAYA_DAFTAR.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Controller */}
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          <Clock className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={currentTime}
            onChange={(e) => onTimeChange(e.target.value)}
            placeholder="09:00"
            className="w-16 bg-slate-900 text-white text-xs font-mono font-bold px-2 py-1 rounded border border-slate-600 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-xs text-slate-400">WIB</span>
        </div>

        {/* Timelapse Toggle */}
        <button
          onClick={onToggleTimelapse}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
            timelapseActive
              ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {timelapseActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{timelapseActive ? 'Berhenti Timelapse' : 'Mulai Timelapse'}</span>
        </button>

        {/* Mission Board Button */}
        <button
          onClick={onOpenMissionBoard}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
        >
          <span>Mission Board</span>
        </button>

        {/* Reels Preview */}
        <button
          onClick={onOpenTimelapseModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/30"
          title="Rekam Video Reels"
        >
          <Film className="w-4 h-4" />
          <span className="hidden md:inline">Rekam Reels</span>
        </button>

        {/* Help */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          title="Bantuan & Kredit"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <div className="absolute top-20 right-6 w-96 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl z-50 text-slate-300 text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-white text-base">Tentang Kantor AI 3D</h3>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white font-bold">×</button>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Kantor isometrik 3D untuk agen AI Anda: Antigravity, Claude Code, dan Gemini Flash. Pantau laporan harian, butir keputusan (!) dan tugas mendesak secara real-time.
          </p>
          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500">
            Kredit Template asli oleh Maliki Saputra (@malikisaputra). Lisensi MIT / Nonkomersial Imagiive Group.
          </div>
        </div>
      )}
    </header>
  );
};
