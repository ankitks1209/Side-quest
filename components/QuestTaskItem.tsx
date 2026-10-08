import type { QuestTask } from "@/lib/quests/schema";
export function QuestTaskItem({ task, index }: { task: QuestTask; index: number }) {
  return <li className="task-card">
    <span className="task-number">0{index + 1}</span>
    <div><span className="eyebrow task-kind">{task.verificationRequired ? "ONE PHOTO" : "JUST FOR YOU"}</span><p>{task.instruction}</p></div>
  </li>;
}
