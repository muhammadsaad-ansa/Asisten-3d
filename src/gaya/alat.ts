import {
  BoxGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
  type Material,
  type Scene,
} from 'three';

export type Peran =
  | 'lantai'
  | 'karpet'
  | 'dinding'
  | 'bingkai'
  | 'kaca'
  | 'kayu'
  | 'meja'
  | 'kursi'
  | 'baju'
  | 'celana'
  | 'kulit'
  | 'rambut'
  | 'layar'
  | 'buku'
  | 'lampu'
  | 'catatan'
  | 'papan'
  | 'kertas'
  | 'pot'
  | 'daun'
  | 'batang'
  | 'tanah'
  | 'batu'
  | 'alas'
  | 'garis'
  | 'awan'
  | 'kaki'
  | 'sofa';

export interface Dunia {
  tinggi?: number;
  lebar?: number;
  zoomJauh?: number;
  malam?: (malam: boolean) => void;
  gantiLuar?: boolean;
  tinggiLuar?: number;
  gayaLuar?: string;
}

export interface KitGaya {
  bahan: (warna: string, peran: Peran, emissive?: string) => Material;
  kotak: (w: number, h: number, d: number, peran: Peran) => BoxGeometry;
  tabung: (rt: number, rb: number, h: number, peran: Peran) => CylinderGeometry;
  bola: (r: number, peran: Peran, kubah?: boolean) => SphereGeometry;
  kerucut: (r: number, h: number, peran: Peran, open?: boolean) => ConeGeometry;
  kapsul: (r: number, len: number, peran: Peran) => CapsuleGeometry;
  cahaya: { langit: string; bumi: string; kuat: number; matahari: string; mKuat: number };
  kabut?: [string, string];
  selaluMalam?: boolean;
  warna: (warna: string, peran: Peran) => string;
  agen: { badan: number; kepala: number };
  luar: { ukuran: number; bentuk: 'kotak' | 'bulat'; alas?: string; awan?: boolean };
  hias?: (mesh: Mesh, peran: Peran) => void;
  dunia?: (ctx: {
    scene: Scene;
    kantor: Group;
    K: KitGaya;
    pasang: (g: any, m: Material, x: number, y: number, z: number, induk?: any) => Mesh;
  }) => Dunia;
  dispose: () => void;
}

export function buatKitGaya(gayaId = 'asli'): KitGaya {
  const mats: Material[] = [];
  const mat = (color: string, peran: Peran, emissive = '#000000') => {
    const m = new MeshLambertMaterial({ color, emissive, emissiveIntensity: emissive !== '#000000' ? 0.4 : 0 });
    m.userData = { peran };
    mats.push(m);
    return m;
  };

  let colorMap = (c: string) => c;
  if (gayaId === 'hologram') {
    colorMap = (c) => (c === '#271b3f' ? '#0f172a' : c);
  }

  return {
    bahan: (c, p, e) => mat(colorMap(c), p, e),
    kotak: (w, h, d) => new BoxGeometry(w, h, d),
    tabung: (rt, rb, h) => new CylinderGeometry(rt, rb, h, 16),
    bola: (r) => new SphereGeometry(r, 16, 16),
    kerucut: (r, h, _, open) => new ConeGeometry(r, h, 16, 1, open),
    kapsul: (r, len) => new CapsuleGeometry(r, len, 8, 16),
    cahaya: {
      langit: gayaId === 'hologram' ? '#38bdf8' : '#ffffff',
      bumi: gayaId === 'hologram' ? '#0f172a' : '#cbd5e1',
      kuat: gayaId === 'hologram' ? 1.5 : 0.9,
      matahari: gayaId === 'hologram' ? '#06b6d4' : '#ffffff',
      mKuat: 1.2,
    },
    kabut: gayaId === 'hologram' ? ['#030712', '#0f172a'] : undefined,
    selaluMalam: gayaId === 'hologram' || gayaId === 'angkringan',
    warna: (c) => colorMap(c),
    agen: { badan: 1, kepala: gayaId === 'vinyl' ? 1.35 : 1 },
    luar: { ukuran: 24, bentuk: 'kotak', awan: true },
    dispose: () => {
      for (const m of mats) m.dispose();
    },
  };
}
