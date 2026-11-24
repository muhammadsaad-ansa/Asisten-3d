export interface Agent {
  key: string;
  name: string;
  role: string;
  room: string;
  color: string;
  shirtColor: string;
  position: [number, number, number];
  deskPosition: [number, number, number];
  status: 'working' | 'break' | 'studying' | 'reporting';
  currentTask: string;
}

export interface Room {
  id: string;
  name: string;
  color: string;
  floorColor: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export interface AgentReport {
  ringkasan: string;
  menunggu: string[];
  mendesak: string[];
  angka: { label: string; value: string }[];
}

export type ReportsData = Record<string, AgentReport>;

export type OfficeStyle =
  | 'asli'
  | 'clay'
  | 'felt'
  | 'voxel'
  | 'vinyl'
  | 'diorama'
  | 'kayu'
  | 'stickman'
  | 'pulau'
  | 'toko'
  | 'menara'
  | 'taman'
  | 'gedung30'
  | 'hologram'
  | 'angkringan'
  | 'pecellele'
  | 'bakso';
