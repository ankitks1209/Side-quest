import type { QuestSummary } from "@/lib/quests/schema";
import type { EvidenceCompletionStatus } from "@/lib/evidence/schema";
export function CompletionSummary({ summary, evidenceStatus, onRestart }: { summary: QuestSummary; evidenceStatus: EvidenceCompletionStatus; onRestart: () => void }) {
  return <div className="completion">
    <div className="completion-stamp" aria-hidden="true"><span>↗</span></div>
    <div className="eyebrow">MISSION COMPLETE</div>
    <h1>A little less screen.<br /><span className="serif">A little more world.</span></h1>
    <div className="ratio-card">
      <div className="eyebrow">YOUR AWAY RATIO</div>
      <div className="ratio">{Math.round(summary.awayRatio * 100)}<span>%</span></div>
      <p>Time for the world around you.</p>
      <div className="ratio-track" aria-hidden="true"><span style={{ width: `${summary.awayRatio * 100}%` }} /></div>
      <div className="metric-row"><div><strong>22:14</strong><span>estimated outside</span></div><div><strong>00:51</strong><span>screen interaction</span></div></div>
    </div>
    <div className="discovery-row"><span aria-hidden="true">◎</span><div><strong>{summary.completedTasks} {summary.completedTasks === 1 ? "discovery" : "discoveries"}</strong><p>Small things. A different perspective.</p></div></div>
    <div className={`evidence-receipt ${evidenceStatus}`}><strong>{evidenceStatus === "verified" ? "Photo discovery verified" : evidenceStatus === "verification_unavailable" ? "Photo verification unavailable" : "Photo discovery not verified"}</strong><span>{evidenceStatus === "verified" ? "Visible evidence matched the mission." : "The photo was not counted in discoveries."}</span></div>
    <div className="demo-note">DEMO METRICS · These times were not measured.</div>
    <p className="footnote">Away Ratio will estimate time away using app visibility and session timing. It is not device-wide screen time.</p>
    <button className="button primary" onClick={onRestart}>Find another SideQuest <span aria-hidden="true">↗</span></button>
    <p className="completion-signoff">Leave with something you didn’t arrive with.</p>
  </div>;
}
