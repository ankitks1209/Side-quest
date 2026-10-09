"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QuestSetup } from "./QuestSetup";
import { QuestTaskItem } from "./QuestTaskItem";
import { EvidenceUploader } from "./EvidenceUploader";
import { CompletionSummary } from "./CompletionSummary";
import { DEFAULT_INPUT } from "@/lib/quests/fixtures";
import { QuestGenerationResponseSchema } from "@/lib/quests/generation-schema";
import type { EvidenceCompletionStatus } from "@/lib/evidence/schema";
import { loadPreferences, savePreferences } from "@/lib/storage/preferences";
import { clearActiveSession, loadActiveSession, saveActiveSession } from "@/lib/sessions/storage";
import { completeQuestSession, enterEvidence, flushVisibleSegment, restoreActiveSession, startQuestSession, startVisibleSegment, updateEvidenceProgress } from "@/lib/sessions/timing";
import type { ActiveSessionRecord } from "@/lib/sessions/schema";
import type { Quest, QuestInput, QuestSummary, VerificationResult } from "@/lib/quests/schema";

type Screen = "landing" | "setup" | "quest" | "evidence" | "completion";
const screenLabels = { landing: "FIELD NOTES / VOL. 01", setup: "YOUR ADVENTURE", quest: "YOUR MISSION", evidence: "YOUR DISCOVERIES", completion: "THE RETURN" };
export function SideQuest() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [input, setInput] = useState<QuestInput>(DEFAULT_INPUT);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [active, setActive] = useState(false);
  const [summary, setSummary] = useState<QuestSummary | null>(null);
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceCompletionStatus | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSessionRecord | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const activeSessionRef = useRef<ActiveSessionRecord | null>(null);
  const sessionWarningShownRef = useRef(false);

  function reportSessionStorageWarning(message: string | null) {
    if (message && !sessionWarningShownRef.current) {
      sessionWarningShownRef.current = true;
      setWarning(message);
    }
  }

  function keepActiveSession(record: ActiveSessionRecord) {
    activeSessionRef.current = record;
    setActiveSession(record);
    reportSessionStorageWarning(saveActiveSession(record));
  }

  useEffect(() => {
    const loaded = loadActiveSession();
    reportSessionStorageWarning(loaded.warning);
    if (!loaded.value) return;
    const restored = restoreActiveSession(loaded.value, Date.now(), document.visibilityState === "visible");
    activeSessionRef.current = restored;
    // Restoration is a one-time synchronization from browser storage after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveSession(restored);
    setQuest(restored.quest);
    setActive(true);
    setScreen(restored.phase === "active" ? "quest" : "evidence");
    reportSessionStorageWarning(saveActiveSession(restored));
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    function updateVisibility() {
      const current = activeSessionRef.current;
      if (!current) return;
      const next = document.visibilityState === "hidden"
        ? flushVisibleSegment(current, Date.now())
        : startVisibleSegment(current, Date.now());
      keepActiveSession(next);
    }
    function flushPage() {
      const current = activeSessionRef.current;
      if (!current) return;
      keepActiveSession(flushVisibleSegment(current, Date.now()));
    }
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pagehide", flushPage);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pagehide", flushPage);
    };
  // Listener lifetime follows the presence of an active session; handlers read the current ref.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession]);
  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => mainRef.current?.focus());
  }
  function start() {
    activeSessionRef.current = null;
    setActiveSession(null);
    reportSessionStorageWarning(clearActiveSession());
    const saved = loadPreferences();
    if (saved.input) setInput(saved.input);
    setWarning(saved.warning);
    setActive(false);
    navigate("setup");
  }
  function beginQuest() {
    if (!quest) return;
    reportSessionStorageWarning(clearActiveSession());
    const session = startQuestSession(quest, Date.now(), document.visibilityState === "visible");
    keepActiveSession(session);
    setActive(true);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus();
  }
  function returnToEvidence() {
    const current = activeSessionRef.current;
    if (current) keepActiveSession(enterEvidence(current));
    navigate("evidence");
  }
  function saveEvidenceProgress(completedTaskIds: string[], result: VerificationResult | null) {
    const current = activeSessionRef.current;
    const photoTask = current?.quest.tasks.find((task) => task.verificationRequired);
    if (current && photoTask) keepActiveSession(updateEvidenceProgress(current, completedTaskIds, photoTask.id, result));
  }
  function finishQuest(completedTaskIds: string[], status: EvidenceCompletionStatus, result?: VerificationResult) {
    const current = activeSessionRef.current;
    const photoTask = current?.quest.tasks.find((task) => task.verificationRequired);
    if (!current || !photoTask) return;
    const completed = completeQuestSession(current, Date.now(), completedTaskIds, photoTask.id, result ?? null);
    setEvidenceStatus(status);
    setSummary(completed.summary);
    activeSessionRef.current = null;
    setActiveSession(null);
    navigate("completion");
    reportSessionStorageWarning(clearActiveSession());
  }
  function goHome() {
    activeSessionRef.current = null;
    setActiveSession(null);
    reportSessionStorageWarning(clearActiveSession());
    setWarning(null);
    navigate("landing");
  }
  async function generate() {
    if (isGenerating) return;
    setWarning(savePreferences(input));
    setIsGenerating(true);
    try {
      const response = await fetch("/api/quests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("quest_generation_failed");
      const result = QuestGenerationResponseSchema.safeParse(await response.json());
      if (!result.success) throw new Error("invalid_generation_response");
      setQuest(result.data.quest);
      setWarning(result.data.source === "fallback" ? "We made you a safe backup quest." : null);
      setActive(false);
      navigate("quest");
    } catch {
      setWarning("We couldn’t prepare a quest right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }
  return <div className="app-shell">
    <header className="header"><Link href="/" onClick={goHome} className="wordmark" aria-label="SideQuest home"><span className="brand-mark" aria-hidden="true">↗</span>SIDEQUEST<span className="brand-dot">.</span></Link><span className="header-note">GO FIND SOMETHING.</span></header>
    <main ref={mainRef} tabIndex={-1} className={`main-content ${screen === "landing" ? "landing" : ""}`} aria-label={screenLabels[screen]}>
      <div className="page-meta"><span>{screenLabels[screen]}</span><span>{screen === "landing" ? "EST. 2026" : "PLAN 4A / BETA"}</span></div>
      {screen === "landing" && <>
        <div className="trail-art" aria-hidden="true">
          <svg viewBox="0 0 340 220" fill="none"><path d="M-20 176C54 96 27 197 117 136S173 72 235 99 273 10 365 30" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" /><path d="M28 159 59 109l31 50H28Z" stroke="currentColor" strokeWidth="1.5" /><path d="m51 122 8 10 8-10M237 51v40m-15-20h30" stroke="currentColor" strokeWidth="1.5" /><circle cx="286" cy="44" r="19" fill="var(--lime)" /><path d="m278 52 16-16m-14 0h14v14" stroke="var(--ink)" strokeWidth="2" /><circle cx="120" cy="135" r="5" fill="var(--ink)" /><path d="M-10 211C78 149 206 219 358 140M-10 226C78 164 206 234 358 155" stroke="currentColor" strokeOpacity=".16" /></svg>
          <span className="art-caption">NO COORDINATES REQUIRED.</span>
        </div>
        <div className="eyebrow">THE WORLD IS THE INTERFACE</div>
        <h1>Your next adventure<br />is <span className="serif">outside</span><br />this app.</h1>
        <p className="lede">A small mission. A fresh perspective.<br />Something worth putting your phone away for.</p>
        <button className="button primary" onClick={start}>Start a SideQuest <span aria-hidden="true">↗</span></button>
        <div className="landing-details"><span>15–60 MINUTES</span><span>NO MAP. JUST CURIOSITY.</span></div>
        <div className="field-note"><span aria-hidden="true">◎</span><p>You don’t need to go far<br />to find something new.</p></div>
      </>}
      {screen === "setup" && <QuestSetup input={input} isGenerating={isGenerating} onChange={setInput} onGenerate={generate} />}
      {screen === "quest" && quest && (active ? <div className="active-quest">
        <div className="active-symbol" aria-hidden="true">↗</div><div className="eyebrow">QUEST STARTED</div>
        <h1>Put your<br /><span className="serif">phone away.</span></h1><p className="lede">We’ll be here when you’re back.</p>
        <div className="active-receipt"><strong>{quest.title}</strong><span>{quest.durationMinutes} minutes · {quest.tasks.length} small discoveries</span></div>
        <p className="safety-note">Stay on safe public paths. Skip anything that feels unsafe. There’s no rush.</p>
        <button className="button primary" onClick={returnToEvidence}>I’m back <span aria-hidden="true">↗</span></button>
        <p className="footnote">Away Ratio uses SideQuest visibility to estimate time away.</p>
      </div> : <>
        <div className="eyebrow">02 / A MISSION IN THE EVERYDAY</div>
        <div className="quest-tags"><span>{quest.durationMinutes} MIN</span><span>{quest.mood}</span><span>{quest.environment}</span></div>
        <h1 className="quest-title">{quest.title}</h1><p className="lede">{quest.intro}</p>
        <ol className="task-list">{quest.tasks.map((task, index) => <QuestTaskItem key={task.id} task={task} index={index} />)}</ol>
        <p className="safety-note">Stay on public paths. Observe without disturbing. Take your time, and skip anything unsafe.</p>
        <button className="button primary" onClick={beginQuest}>Begin SideQuest <span aria-hidden="true">↗</span></button>
        <button className="text-button" onClick={() => navigate("setup")}>Adjust my choices</button>
      </>)}
      {screen === "evidence" && quest && <EvidenceUploader quest={quest} initialCompletedTaskIds={activeSession?.questSession.completedTaskIds} initialVerificationResult={activeSession?.questSession.verificationResults[quest.tasks.find((task) => task.verificationRequired)?.id ?? ""]} onProgress={saveEvidenceProgress} onComplete={finishQuest} />}
      {screen === "completion" && summary && evidenceStatus && quest && <CompletionSummary summary={summary} totalTasks={quest.tasks.length} evidenceStatus={evidenceStatus} onRestart={start} />}
      {warning && <p className="warning" role="status">{warning}</p>}
    </main>
    <footer className="footer"><span>SIDEQUEST / TAKE THE SCENIC MOMENT</span><span aria-hidden="true">↗</span></footer>
  </div>;
}
