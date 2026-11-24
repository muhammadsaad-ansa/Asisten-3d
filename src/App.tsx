import React, { useState, useEffect, useRef } from 'react';
import { AGEN, DEFAULT_REPORTS } from './config';
import { OfficeStyle, ReportsData } from './types';
import { officeDesks, isoDay, isNight, lapseAt } from './office';
import OfficeScene from './OfficeScene';
import { Header } from './components/Header';
import { MissionBoardModal } from './components/MissionBoardModal';
import { TimelapseModal } from './components/TimelapseModal';

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState<OfficeStyle>('asli');
  const [currentTime, setCurrentTime] = useState<string>('09:15');
  const [timelapseActive, setTimelapseActive] = useState<boolean>(false);
  const [reports, setReports] = useState<ReportsData>(DEFAULT_REPORTS);

  const [isMissionBoardOpen, setIsMissionBoardOpen] = useState<boolean>(false);
  const [isTimelapseModalOpen, setIsTimelapseModalOpen] = useState<boolean>(false);
  const [selectedAgentKey, setSelectedAgentKey] = useState<string | null>(null);

  const anchorsRef = useRef<Map<string, HTMLElement>>(new Map());
  const boardAnchorRef = useRef<HTMLElement | null>(null);

  const night = isNight(currentTime);

  // Timelapse clock
  useEffect(() => {
    if (!timelapseActive) return;
    let start = performance.now();
    const interval = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      const { time } = lapseAt(elapsed);
      setCurrentTime(time);
    }, 100);
    return () => clearInterval(interval);
  }, [timelapseActive]);

  const today = isoDay(new Date());
  const desksState = officeDesks(today, currentTime, true);
  const boardCount = desksState.reduce((acc, d) => acc + (d.waiting?.length || 0), 0);

  return (
    <div className={`ko ${night ? 'night' : ''}`} data-night={night ? '' : undefined} data-gaya={selectedStyle}>
      <Header
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        timelapseActive={timelapseActive}
        onToggleTimelapse={() => setTimelapseActive(!timelapseActive)}
        onOpenMissionBoard={() => {
          setSelectedAgentKey(null);
          setIsMissionBoardOpen(true);
        }}
        onOpenTimelapseModal={() => setIsTimelapseModalOpen(true)}
      />

      <main className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
        <div className="ko-stage relative flex-1 w-full rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
          <OfficeScene
            desks={desksState}
            night={night}
            boardCount={boardCount}
            anchors={anchorsRef}
            boardAnchor={boardAnchorRef}
            gaya={selectedStyle}
          />

          <div className="ko-layer">
            {AGEN.map((ag) => {
              const dState = desksState.find((d) => d.desk.key === ag.key);
              const rep = reports[ag.key];
              const hasUrgent = rep?.mendesak?.length > 0;
              const hasPending = rep?.menunggu?.length > 0;
              return (
                <div
                  key={ag.key}
                  ref={(node) => {
                    if (node) anchorsRef.current.set(ag.key, node);
                    else anchorsRef.current.delete(ag.key);
                  }}
                  className="ko-tag"
                  data-act={dState?.doing.activity || 'kerja'}
                  style={{ '--agent': ag.warna } as any}
                >
                  <div className="ko-tag-in">
                    <div className="ko-tag-row">
                      <button
                        onClick={() => {
                          setSelectedAgentKey(ag.key);
                          setIsMissionBoardOpen(true);
                        }}
                        className="ko-name"
                      >
                        <span className="ko-dot" />
                        <span>{ag.nama}</span>
                        <span className="ko-name-act">{ag.peran}</span>
                      </button>
                      {hasUrgent && (
                        <button
                          onClick={() => {
                            setSelectedAgentKey(ag.key);
                            setIsMissionBoardOpen(true);
                          }}
                          className="ko-bang"
                          data-mine
                          title="Butir Mendesak!"
                        >
                          ! <small>{rep.mendesak.length}</small>
                        </button>
                      )}
                      {!hasUrgent && hasPending && (
                        <button
                          onClick={() => {
                            setSelectedAgentKey(ag.key);
                            setIsMissionBoardOpen(true);
                          }}
                          className="ko-bang"
                          title="Menunggu Keputusan"
                        >
                          ? <small>{rep.menunggu.length}</small>
                        </button>
                      )}
                    </div>
                    <div className="ko-label">
                      <span>{dState?.doing.label || ag.peran}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              ref={(node) => {
                boardAnchorRef.current = node;
              }}
              className="ko-board-pin"
              onClick={() => {
                setSelectedAgentKey(null);
                setIsMissionBoardOpen(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              Mission Board ({boardCount})
            </div>
          </div>
        </div>
      </main>

      <MissionBoardModal
        isOpen={isMissionBoardOpen}
        onClose={() => setIsMissionBoardOpen(false)}
        agents={AGEN.map(a => ({ key: a.key, name: a.nama, role: a.peran, room: a.ruang, color: a.warna, shirtColor: a.warna, position: [a.x, 0, a.z], deskPosition: [a.x, 0, a.z], status: 'working', currentTask: '' }))}
        reports={reports}
        onUpdateReports={setReports}
        initialAgentKey={selectedAgentKey}
      />

      <TimelapseModal
        isOpen={isTimelapseModalOpen}
        onClose={() => setIsTimelapseModalOpen(false)}
      />
    </div>
  );
}
