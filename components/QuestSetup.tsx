import type { QuestInput } from "@/lib/quests/schema";

const moods = [
  { value: "explore", label: "Explore", symbol: "↗", detail: "Find the unexpected" },
  { value: "relax", label: "Relax", symbol: "≈", detail: "Take it slowly" },
  { value: "move", label: "Move", symbol: "→", detail: "Stretch your legs" },
  { value: "notice", label: "Notice", symbol: "◎", detail: "Look a little closer" },
] as const;
export function QuestSetup({ input, onChange, onGenerate }: {
  input: QuestInput; onChange: (input: QuestInput) => void; onGenerate: () => void;
}) {
  return <>
    <div className="eyebrow">01 / PACK LIGHT</div>
    <h1>Make room for<br /><span className="serif">a little outside.</span></h1>
    <p className="lede">A few choices. A small adventure. All yours.</p>
    <fieldset><legend>How much time do you have?</legend>
      <div className="grid grid-cols-3 gap-2">{([15, 30, 60] as const).map((duration) =>
        <button type="button" className={`choice duration ${input.durationMinutes === duration ? "selected" : ""}`} aria-pressed={input.durationMinutes === duration} key={duration} onClick={() => onChange({ ...input, durationMinutes: duration })}>
          <strong>{duration}</strong><span>minutes</span>
        </button>)}</div>
    </fieldset>
    <fieldset><legend>What feels right?</legend>
      <div className="grid grid-cols-2 gap-2">{moods.map((mood) =>
        <button type="button" className={`choice mood ${input.mood === mood.value ? "selected" : ""}`} aria-pressed={input.mood === mood.value} key={mood.value} onClick={() => onChange({ ...input, mood: mood.value })}>
          <span aria-hidden="true" className="mood-symbol">{mood.symbol}</span><strong>{mood.label}</strong><span>{mood.detail}</span>
        </button>)}</div>
    </fieldset>
    <fieldset><legend>What’s around you?</legend>
      <div className="grid grid-cols-3 gap-2">{(["city", "park", "anywhere"] as const).map((environment) =>
        <button type="button" className={`choice environment ${input.environment === environment ? "selected" : ""}`} aria-pressed={input.environment === environment} key={environment} onClick={() => onChange({ ...input, environment })}>{environment}</button>)}</div>
    </fieldset>
    <button className="button primary" onClick={onGenerate}>Generate my SideQuest <span aria-hidden="true">↗</span></button>
    <p className="footnote">Plan 1 · Curated mock quests. No AI calls.</p>
  </>;
}
