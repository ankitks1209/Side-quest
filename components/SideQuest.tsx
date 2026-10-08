"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { QuestSetup } from "./QuestSetup";
import { QuestTaskItem } from "./QuestTaskItem";
import { EvidenceUploader } from "./EvidenceUploader";
import { CompletionSummary } from "./CompletionSummary";
import { DEFAULT_INPUT, selectMockQuest } from "@/lib/quests/fixtures";
import { createDemoSummary } from "@/lib/quests/demo-summary";
import { loadPreferences, savePreferences } from "@/lib/storage/preferences";
import type { Quest, QuestInput, QuestSummary } from "@/lib/quests/schema";

type Screen = "landing" | "setup" | "quest" | "evidence" | "completion";
const screenLabels = { landing: "FIELD NOTES / VOL. 01", setup: "YOUR ADVENTURE", quest: "YOUR MISSION", evidence: "YOUR DISCOVERIES", completion: "THE RETURN" };
export function SideQuest() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [input, setInput] = useState<QuestInput>(DEFAULT_INPUT);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [active, setActive] = useState(false);
  const [summary, setSummary] = useState<QuestSummary | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => mainRef.current?.focus());
  }
  function start() {
    const saved = loadPreferences();
    if (saved.input) setInput(saved.input);
    setWarning(saved.warning);
    setActive(false);
    navigate("setup");
  }
  function generate() {
    setWarning(savePreferences(input));
    setQuest(selectMockQuest(input));
    setActive(false);
    navigate("quest");
  }
  return <div className="app-shell">
    <header className="header"><Link href="/" onClick={() => { setWarning(null); navigate("landing"); }} className="wordmark" aria-label="SideQuest home"><span className="brand-mark" aria-hidden="true">↗</span>SIDEQUEST<span className="brand-dot">.</span></Link><span className="header-note">GO FIND SOMETHING.</span></header>
    <main ref={mainRef} tabIndex={-1} className={`main-content ${screen === "landing" ? "landing" : ""}`} aria-label={screenLabels[screen]}>
      <div className="page-meta"><span>{screenLabels[screen]}</span><span>{screen === "landing" ? "EST. 2026" : "PLAN 1 / DEMO"}</span></div>
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
      {screen === "setup" && <QuestSetup input={input} onChange={setInput} onGenerate={generate} />}
      {screen === "quest" && quest && (active ? <div className="active-quest">
        <div className="active-symbol" aria-hidden="true">↗</div><div className="eyebrow">QUEST STARTED</div>
        <h1>Put your<br /><span className="serif">phone away.</span></h1><p className="lede">We’ll be here when you’re back.</p>
        <div className="active-receipt"><strong>{quest.title}</strong><span>{quest.durationMinutes} minutes · {quest.tasks.length} small discoveries</span></div>
        <p className="safety-note">Stay on safe public paths. Skip anything that feels unsafe. There’s no rush.</p>
        <button className="button primary" onClick={() => navigate("evidence")}>I’m back <span aria-hidden="true">↗</span></button>
        <p className="footnote">This demo does not track time away.</p>
      </div> : <>
        <div className="eyebrow">02 / A MISSION IN THE EVERYDAY</div>
        <div className="quest-tags"><span>{quest.durationMinutes} MIN</span><span>{quest.mood}</span><span>{quest.environment}</span></div>
        <h1 className="quest-title">{quest.title}</h1><p className="lede">{quest.intro}</p>
        <ol className="task-list">{quest.tasks.map((task, index) => <QuestTaskItem key={task.id} task={task} index={index} />)}</ol>
        <p className="safety-note">Stay on public paths. Observe without disturbing. Take your time, and skip anything unsafe.</p>
        <button className="button primary" onClick={() => { setActive(true); window.scrollTo({ top: 0 }); mainRef.current?.focus(); }}>Begin SideQuest <span aria-hidden="true">↗</span></button>
        <button className="text-button" onClick={() => navigate("setup")}>Adjust my choices</button>
      </>)}
      {screen === "evidence" && quest && <EvidenceUploader quest={quest} onComplete={(ids) => { setSummary(createDemoSummary(ids.length)); navigate("completion"); }} />}
      {screen === "completion" && summary && <CompletionSummary summary={summary} onRestart={start} />}
      {warning && <p className="warning" role="status">{warning}</p>}
    </main>
    <footer className="footer"><span>SIDEQUEST / TAKE THE SCENIC MOMENT</span><span aria-hidden="true">↗</span></footer>
  </div>;
}
