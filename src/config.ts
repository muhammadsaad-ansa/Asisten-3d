import { OfficeStyle } from './types';

export type RoomKey = 'utama' | 'rapat' | 'santai';

export interface Agen {
  key: string;
  nama: string;
  peran: string;
  ruang: RoomKey;
  warna: string;
  x: number;
  z: number;
}

export const AGEN: Agen[] = [
  {
    key: 'antigravity',
    nama: 'Antigravity',
    peran: 'Lead Architect',
    ruang: 'utama',
    warna: '#3b82f6',
    x: -3,
    z: -2,
  },
  {
    key: 'claudecode',
    nama: 'Claude Code',
    peran: 'Senior Fullstack Dev',
    ruang: 'utama',
    warna: '#10b981',
    x: -1,
    z: 2,
  },
  {
    key: 'geminiflash',
    nama: 'Gemini Flash',
    peran: 'Ops & Content Lead',
    ruang: 'rapat',
    warna: '#f59e0b',
    x: 4,
    z: -2.5,
  },
];

export const RUANGAN = [
  { id: 'utama', nama: 'Ruang Utama & Dev', x0: -7, x1: 1.5, warna: '#f8fafc', karpet: '#cbd5e1' },
  { id: 'rapat', nama: 'Mission Board & Rapat', x0: 1.5, x1: 4.5, warna: '#f1f5f9', karpet: '#e2e8f0' },
  { id: 'santai', nama: 'Pojok Santai & Kopi', x0: 4.5, x1: 7, warna: '#f8fafc', karpet: '#f1f5f9' },
];

export const JAM_KANTOR = {
  buka: '08:00',
  tutup: '17:00',
};

export const JADWAL = [
  { agen: '*', hari: [1, 2, 3, 4, 5], mulai: '08:00', menit: 60, aktivitas: 'siaga' as const, label: 'standup pagi & briefing' },
  { agen: '*', hari: [1, 2, 3, 4, 5], mulai: '09:00', menit: 240, aktivitas: 'kerja' as const, label: 'fokus development & coding' },
  { agen: '*', hari: [1, 2, 3, 4, 5], mulai: '13:00', menit: 60, aktivitas: 'belajar' as const, label: 'riset & benchmark AI model' },
  { agen: '*', hari: [1, 2, 3, 4, 5], mulai: '14:00', menit: 180, aktivitas: 'kerja' as const, label: 'eksekusi task & integrasi sistem' },
  { agen: '*', hari: [1, 2, 3, 4, 5], mulai: '17:00', menit: 60, aktivitas: 'laporan' as const, label: 'menulis laporan sore' },
];

export const BABAK = [
  { detik: 10, dari: '08:00', sampai: '12:00', judul: 'Pagi: Briefing & Sprints' },
  { detik: 10, dari: '12:00', sampai: '17:00', judul: 'Sore: Eksekusi & Integrasi' },
  { detik: 10, dari: '17:00', sampai: '21:00', judul: 'Malam: Laporan & Riset' },
];

export const LAPORAN: Record<string, any> = {
  antigravity: {
    ringkasan: "Sistem otonom berjalan lancar dengan 99.8% uptime. Sinkronisasi API Claude & Gemini stabil tanpa latensi tinggi.",
    menunggu: [
      "Persetujuan alokasi server cloud region baru (US-East)",
      "Konfirmasi protokol enkripsi end-to-end token OAuth"
    ],
    mendesak: [
      "Perlu otorisasi token akses Google Workspace API v3"
    ],
    angka: [
      { label: "Uptime Sistem", value: "99.8%" },
      { label: "Total Task Selesai", value: "142" },
      { label: "Efisiensi API", value: "4ms" }
    ]
  },
  claudecode: {
    ringkasan: "Menyelesaikan 18 PR hari ini. Modul database migrasi Drizzle PostgreSQL sukses tanpa error.",
    menunggu: [
      "Review pull request branch feature/realtime-chat",
      "Validasi skema migrasi tabel users & permissions"
    ],
    mendesak: [
      "Fix bug kecil pada koneksi WebSocket reconnect timeout"
    ],
    angka: [
      { label: "Pull Requests", value: "18" },
      { label: "Test Coverage", value: "94.5%" },
      { label: "Bug Teratasi", value: "7" }
    ]
  },
  geminiflash: {
    ringkasan: "Laporan harian otomatis terkirim ke Slack & Email stakeholder. Sentimen pengguna positif 98%.",
    menunggu: [
      "Persetujuan jadwal rilis fitur mobile web PWA v2.1",
      "Finalisasi teks banner promosi kuartal ini"
    ],
    mendesak: [
      "Update dokumentasi API untuk mitra eksternal"
    ],
    angka: [
      { label: "Laporan Terkirim", value: "24" },
      { label: "Sentimen Positif", value: "98%" },
      { label: "Dokumentasi", value: "100%" }
    ]
  }
};

export const DEFAULT_REPORTS = LAPORAN;
