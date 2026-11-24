import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Agent, OfficeStyle, ReportsData } from '../types';
import { GAYA_DAFTAR } from '../gaya/daftar';

interface OfficeCanvasProps {
  agents: Agent[];
  reports: ReportsData;
  selectedStyle: OfficeStyle;
  currentTime: string; // e.g. "09:00"
  onSelectAgent: (agentKey: string) => void;
  timelapseActive: boolean;
}

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({
  agents,
  reports,
  selectedStyle,
  currentTime,
  onSelectAgent,
  timelapseActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);
  const agentsGroupRef = useRef<THREE.Group[]>([]);
  const selectedAgentKeyRef = useRef<string | null>(null);

  // Get style meta
  const styleMeta = GAYA_DAFTAR.find((g) => g.id === selectedStyle) || GAYA_DAFTAR[0];

  useEffect(() => {
    if (!containerRef.current) return;

    // Width & Height
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      selectedStyle === 'hologram' || selectedStyle === 'menara' || selectedStyle === 'angkringan'
        ? '#090d16'
        : styleMeta.wallColor
    );

    // Camera (Isometric projection)
    const aspect = width / height;
    const d = 12;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(
      selectedStyle === 'hologram' ? '#06b6d4' : selectedStyle === 'angkringan' ? '#fef08a' : '#ffffff',
      selectedStyle === 'hologram' ? 1.5 : 0.8
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      selectedStyle === 'hologram' ? '#38bdf8' : '#ffffff',
      1.2
    );
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Floor Base
    const floorGeo = new THREE.PlaneGeometry(16, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: styleMeta.floorColor,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper or floor lines
    const gridHelper = new THREE.GridHelper(16, 16, styleMeta.primaryColor, '#cbd5e1');
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Room divider walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: styleMeta.wallColor,
      roughness: 0.9,
    });

    const wall1Geo = new THREE.BoxGeometry(0.2, 3, 12);
    const wall1 = new THREE.Mesh(wall1Geo, wallMat);
    wall1.position.set(1.5, 1.5, 0);
    wall1.castShadow = true;
    scene.add(wall1);

    // Add Furniture & Decor
    // Mission Board in room 2
    const boardGeo = new THREE.BoxGeometry(3, 2, 0.2);
    const boardMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(4.5, 2, -3.9);
    scene.add(board);

    // Mission Board screen glow
    const screenGeo = new THREE.PlaneGeometry(2.8, 1.8);
    const screenMat = new THREE.MeshBasicMaterial({ color: styleMeta.primaryColor });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(4.5, 2, -3.78);
    scene.add(screen);

    // Sofa in room 3 (Pojok Santai)
    const sofaBaseGeo = new THREE.BoxGeometry(3, 0.5, 1.2);
    const sofaMat = new THREE.MeshStandardMaterial({ color: '#64748b' });
    const sofa = new THREE.Mesh(sofaBaseGeo, sofaMat);
    sofa.position.set(4.5, 0.25, 2.5);
    sofa.castShadow = true;
    scene.add(sofa);

    const sofaBackGeo = new THREE.BoxGeometry(3, 1, 0.3);
    const sofaBack = new THREE.Mesh(sofaBackGeo, sofaMat);
    sofaBack.position.set(4.5, 0.75, 3.05);
    scene.add(sofaBack);

    // Coffee Machine / Water Dispenser
    const dispGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
    const dispMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.3 });
    const dispenser = new THREE.Mesh(dispGeo, dispMat);
    dispenser.position.set(6.5, 0.75, 1);
    dispenser.castShadow = true;
    scene.add(dispenser);

    agentsGroupRef.current = [];

    // Create Agents & Desks
    agents.forEach((agent) => {
      const agentGroup = new THREE.Group();
      agentGroup.userData = { agentKey: agent.key };

      // Desk
      const deskGeo = new THREE.BoxGeometry(2, 1, 1.2);
      const deskMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.7 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(agent.deskPosition[0], 0.5, agent.deskPosition[2]);
      desk.castShadow = true;
      desk.receiveShadow = true;
      scene.add(desk);

      // Laptop / Monitor on desk
      const laptopBaseGeo = new THREE.BoxGeometry(0.8, 0.05, 0.6);
      const laptopMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8 });
      const laptop = new THREE.Mesh(laptopBaseGeo, laptopMat);
      laptop.position.set(agent.deskPosition[0], 1.025, agent.deskPosition[2]);
      scene.add(laptop);

      const laptopScreenGeo = new THREE.BoxGeometry(0.8, 0.5, 0.05);
      const screenMatColor = selectedStyle === 'hologram' ? '#06b6d4' : agent.color;
      const laptopScreenMat = new THREE.MeshBasicMaterial({ color: screenMatColor });
      const laptopScreen = new THREE.Mesh(laptopScreenGeo, laptopScreenMat);
      laptopScreen.position.set(agent.deskPosition[0], 1.3, agent.deskPosition[2] - 0.25);
      laptopScreen.rotation.x = -0.2;
      scene.add(laptopScreen);

      // Chair
      const chairGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
      const chairMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
      const chair = new THREE.Mesh(chairGeo, chairMat);
      chair.position.set(agent.deskPosition[0], 0.35, agent.deskPosition[2] + 0.9);
      chair.castShadow = true;
      scene.add(chair);

      // Agent Character (Head, Body, Arms)
      const bodyGeo = new THREE.BoxGeometry(0.6, 0.9, 0.4);
      const bodyMat = new THREE.MeshStandardMaterial({ color: agent.shirtColor });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0.8, 0);
      body.castShadow = true;
      agentGroup.add(body);

      const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.6 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, 1.45, 0);
      head.castShadow = true;
      agentGroup.add(head);

      // Position Agent Group sitting on chair
      agentGroup.position.set(agent.deskPosition[0], 0, agent.deskPosition[2] + 0.7);
      scene.add(agentGroup);
      agentsGroupRef.current.push(agentGroup);
    });

    // Raycaster for clicking agents
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Check intersections with agent groups
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && parent && obj !== scene) {
          if (obj.userData && obj.userData.agentKey) {
            onSelectAgent(obj.userData.agentKey);
            break;
          }
          obj = obj.parent;
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('click', onClick);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation or typing movement for agents
      agentsGroupRef.current.forEach((group, idx) => {
        const speed = timelapseActive ? 6 : 2;
        group.position.y = Math.sin(elapsedTime * speed + idx) * 0.03;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      camera.left = -d * (w / h);
      camera.right = d * (w / h);
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('click', onClick);
      cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedStyle, agents, timelapseActive]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden shadow-xl bg-slate-900 border border-slate-700">
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {/* Floating Time & Style Badge Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3 shadow-lg">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono font-bold text-lg">{currentTime} WIB</span>
        <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 uppercase tracking-wider font-semibold">
          Gaya: {selectedStyle}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-700 flex flex-wrap justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Klik Agen di Kantor untuk buka Laporan & Mission Board:</span>
        </div>
        <div className="flex gap-2">
          {agents.map((ag) => {
            const hasUrgent = reports[ag.key]?.mendesak?.length > 0;
            const hasPending = reports[ag.key]?.menunggu?.length > 0;
            return (
              <button
                key={ag.key}
                onClick={() => onSelectAgent(ag.key)}
                className="relative px-3 py-1.5 rounded-lg text-xs font-medium text-white transition hover:scale-105 flex items-center gap-1.5 shadow"
                style={{ backgroundColor: ag.color }}
              >
                <span>{ag.name}</span>
                {hasUrgent && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-bounce">
                    !
                  </span>
                )}
                {!hasUrgent && hasPending && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
