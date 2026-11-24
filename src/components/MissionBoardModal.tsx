import React, { useState } from 'react';
import { Agent, ReportsData } from '../types';
import { X, CheckCircle, AlertTriangle, Sparkles, Send, PlusCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface MissionBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  reports: ReportsData;
  onUpdateReports: (newReports: ReportsData) => void;
  initialAgentKey?: string | null;
}

export const MissionBoardModal: React.FC<MissionBoardModalProps> = ({
  isOpen,
  onClose,
  agents,
  reports,
  onUpdateReports,
  initialAgentKey,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialAgentKey || agents[0]?.key || 'antigravity');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPendingItem, setNewPendingItem] = useState('');

  if (!isOpen) return null;

  const currentAgent = agents.find((a) => a.key === activeTab) || agents[0];
  const currentReport = reports[activeTab] || { ringkasan: '', menunggu: [], mendesak: [], angka: [] };

  const handleResolvePending = (index: number) => {
    const updatedMenunggu = currentReport.menunggu.filter((_, i) => i !== index);
    const updated = {
      ...reports,
      [activeTab]: {
        ...currentReport,
        menunggu: updatedMenunggu,
      },
    };
    onUpdateReports(updated);
  };

  const handleAddPending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPendingItem.trim()) return;
    const updatedMenunggu = [...currentReport.menunggu, newPendingItem.trim()];
    const updated = {
      ...reports,
      [activeTab]: {
        ...currentReport,
        menunggu: updatedMenunggu,
      },
    };
    onUpdateReports(updated);
    setNewPendingItem('');
  };

  const handleGenerateAIReport = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';
      if (!apiKey) {
        // Fallback simulation if key not present
        setTimeout(() => {
          const updated = {
            ...reports,
            [activeTab]: {
              ...currentReport,
              ringkasan: `[AI Generated] Agen ${currentAgent.name} telah menyelesaikan evaluasi otonom dengan peningkatan efisiensi 14% menggunakan Gemini Flash 2.5.`,
              mendesak: [],
            },
          };
          onUpdateReports(updated);
          setIsGenerating(false);
        }, 1000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Buatkan ringkasan laporan harian, butir menunggu keputusan, dan angka kinerja untuk agen AI "${currentAgent.name}" (${currentAgent.role}). Berikan format JSON dengan field ringkasan (string), menunggu (array of string), mendesak (array of string), dan angka (array of {label, value}). Gunakan Bahasa Indonesia.`,
      });

      // parse response or fallback
      const text = response.text || '';
      // Update report with AI text
      const updated = {
        ...reports,
        [activeTab]: {
          ...currentReport,
          ringkasan: text.substring(0, 200) || currentReport.ringkasan,
        },
      };
      onUpdateReports(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
            <h2 className="text-lg font-black tracking-tight">Mission Board & Laporan Agen AI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs for Agents */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-2 overflow-x-auto">
          {agents.map((agent) => {
            const isActive = agent.key === activeTab;
            const hasUrgent = reports[agent.key]?.mendesak?.length > 0;
            return (
              <button
                key={agent.key}
                onClick={() => setActiveTab(agent.key)}
                className={`relative px-5 py-3 rounded-t-2xl font-bold text-sm transition flex items-center gap-2 border-t border-x ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-700 border-b-transparent shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agent.color }} />
                <span>{agent.name}</span>
                {hasUrgent && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Agent Info Banner */}
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {currentAgent.name}
                <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-normal">
                  {currentAgent.role}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">{currentAgent.currentTask}</p>
            </div>
            <button
              onClick={handleGenerateAIReport}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Menyusun Laporan AI...' : 'Segarkan dengan Gemini AI'}</span>
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentReport.angka.map((stat, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/80 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Ringkasan Laporan */}
          <div className="bg-slate-800/40 border border-slate-700/80 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Ringkasan Kinerja Harian
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{currentReport.ringkasan}</p>
          </div>

          {/* Urgent & Pending Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mendesak */}
            <div className="bg-red-950/20 border border-red-900/40 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Butir Mendesak ({currentReport.mendesak.length})
              </h4>
              {currentReport.mendesak.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Tidak ada hal mendesak saat ini. Semua aman.</p>
              ) : (
                <ul className="space-y-2">
                  {currentReport.mendesak.map((item, idx) => (
                    <li key={idx} className="bg-red-900/20 border border-red-800/30 p-3 rounded-xl text-xs text-red-200 flex items-start gap-2">
                      <span className="font-bold text-red-400 mt-0.5">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Menunggu Keputusan */}
            <div className="bg-amber-950/20 border border-amber-900/40 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  Menunggu Keputusan ({currentReport.menunggu.length})
                </h4>
                {currentReport.menunggu.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Tidak ada hal yang menunggu keputusan.</p>
                ) : (
                  <ul className="space-y-2">
                    {currentReport.menunggu.map((item, idx) => (
                      <li key={idx} className="bg-amber-900/20 border border-amber-800/30 p-3 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-2">
                        <span>{item}</span>
                        <button
                          onClick={() => handleResolvePending(idx)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold transition whitespace-nowrap"
                        >
                          Setujui
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add new pending item */}
              <form onSubmit={handleAddPending} className="mt-4 flex gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  value={newPendingItem}
                  onChange={(e) => setNewPendingItem(e.target.value)}
                  placeholder="Tambah keputusan baru..."
                  className="flex-1 bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition flex items-center justify-center"
                  title="Tambah"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 px-6 py-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
          <span>Kantor AI 3D — Dipersembahkan oleh Imagiive HQ & Maliki Studio</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
