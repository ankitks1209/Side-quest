import type { QuestSummary } from "@/lib/quests/schema";
import type { EvidenceCompletionStatus } from "@/lib/evidence/schema";
import { formatDuration } from "@/lib/sessions/format";
export function CompletionSummary({ summary, totalTasks, evidenceStatus, onRestart }: { summary: QuestSummary; totalTasks: number; evidenceStatus: EvidenceCompletionStatus; onRestart: () => void }) {
  return <div className="completion">
    <div className="completion-stamp" aria-hidden="true"><span>↗</span></div>
    <div className="eyebrow">MISSION COMPLETE</div>
    <h1>A little less screen.<br /><span className="serif">A little more world.</span></h1>
    <div className="ratio-card">
      <div className="eyebrow">YOUR AWAY RATIO</div>
      <div className="ratio">{Math.round(summary.awayRatio * 100)}<span>%</span></div>
      <p>Time for the world around you.</p>
      <div className="ratio-track" aria-hidden="true"><span style={{ width: `${summary.awayRatio * 100}%` }} /></div>
      <div className="metric-row"><div><strong>{formatDuration(summary.estimatedAwayMs)}</strong><span>estimated away</span></div><div><strong>{formatDuration(summary.activeScreenMs)}</strong><span>in SideQuest</span></div></div>
    </div>
    <div className="discovery-row"><span aria-hidden="true">◎</span><div><strong>{summary.completedTasks} of {totalTasks} discoveries completed</strong><p>Small things. A different perspective.</p></div></div>
    <div className={`evidence-receipt ${evidenceStatus}`}><strong>{evidenceStatus === "verified" ? "Photo discovery verified" : evidenceStatus === "verification_unavailable" ? "Photo verification unavailable" : "Photo discovery not verified"}</strong><span>{evidenceStatus === "verified" ? "Visible evidence matched the mission." : "The photo was not counted in discoveries."}</span></div>
    <p className="footnote">Away Ratio estimates how much of your quest was spent away from SideQuest based on app visibility. It does not measure device-wide screen time.</p>
    <button className="button primary" onClick={onRestart}>Find another SideQuest <span aria-hidden="true">↗</span></button>
    <p className="completion-signoff">Leave with something you didn’t arrive with.</p>
  </div>;
}
