"use client";
import { useEffect, useState } from "react";
import type { Quest, VerificationResult } from "@/lib/quests/schema";

export function EvidenceUploader({ quest, onComplete }: {
  quest: Quest; onComplete: (ids: string[], result: VerificationResult) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const photoTask = quest.tasks.find((task) => task.verificationRequired)!;
  const selfReportTasks = quest.tasks.filter((task) => !task.verificationRequired);

  useEffect(() => {
    // Release ephemeral image data when changed or when leaving Evidence.
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function finish() {
    onComplete([photoTask.id, ...completed], {
      verified: true, confidence: 1,
      reason: "Development simulation only. No image content was inspected by an AI model.",
    });
  }

  return <>
    <div className="eyebrow">03 / BRING BACK A LITTLE WONDER</div>
    <h1>You’re back.<br /><span className="serif">What did you find?</span></h1>
    <p className="lede">Show us one thing you discovered.</p>
    <div className="demo-note">DEVELOPMENT DEMO · Verification is mocked.</div>
    <p className="evidence-instruction">{photoTask.instruction}</p>
    <label className={`upload-card ${preview ? "has-preview" : ""}`}>
      {preview ? <>
        {/* Local object URL, never uploaded. Native image supports ephemeral previews. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Your selected quest discovery" />
        <span className="preview-label">Change photo</span>
      </> : <><span className="upload-icon" aria-hidden="true">＋</span><strong>Add your discovery</strong><span>Choose one photo · stays on this device</span></>}
      <input aria-label="Choose a discovery photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
        const selected = event.target.files?.[0];
        if (!selected) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 10 * 1024 * 1024) {
          setError("Choose a JPG, PNG, or WebP photo smaller than 10 MB.");
          event.target.value = "";
          return;
        }
        setError(null); setFile(selected); setPreview(URL.createObjectURL(selected)); setVerified(false);
      }} />
    </label>
    {error && <p role="alert" className="warning">{error}</p>}
    {!verified ? <>
      <button className="button primary" disabled={!file} onClick={() => setVerified(true)}>Simulate photo verification <span aria-hidden="true">↗</span></button>
      <button className="text-button" onClick={() => { setVerified(true); setError(null); }}>Continue with demo evidence</button>
      <p className="footnote">No upload or image analysis. You can try the flow without a photo.</p>
    </> : <>
      <div className="verification-result" role="status"><strong>✓ Mock verification complete</strong><p>No image was analyzed. This result is a simulation.</p></div>
      <fieldset className="self-report"><legend>What else did you discover?</legend>
        <p className="muted">Check the tasks you completed. It’s okay to skip one.</p>
        {selfReportTasks.map((task) => <label className="check-task" key={task.id}>
          <input type="checkbox" checked={completed.includes(task.id)} onChange={(event) => setCompleted(event.target.checked ? [...completed, task.id] : completed.filter((id) => id !== task.id))} />
          <span>{task.instruction}</span>
        </label>)}
      </fieldset>
      <button className="button primary" onClick={finish}>Complete my SideQuest <span aria-hidden="true">↗</span></button>
    </>}
  </>;
}
