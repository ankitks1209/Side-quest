"use client";
import { useEffect, useState } from "react";
import { EvidenceVerificationResponseSchema, type EvidenceCompletionStatus } from "@/lib/evidence/schema";
import { createCompletedTaskIds } from "@/lib/evidence/completion";
import { classifyVerification } from "@/lib/evidence/policy";
import type { Quest, VerificationResult } from "@/lib/quests/schema";

type VerificationUiState = "ready" | "checking" | "verified" | "uncertain" | "error";

export function EvidenceUploader({ quest, initialCompletedTaskIds = [], initialVerificationResult, onProgress, onComplete }: {
  quest: Quest;
  initialCompletedTaskIds?: string[];
  initialVerificationResult?: VerificationResult;
  onProgress?: (completedTaskIds: string[], result: VerificationResult | null) => void;
  onComplete: (ids: string[], status: EvidenceCompletionStatus, result?: VerificationResult) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [uiState, setUiState] = useState<VerificationUiState>(() => initialVerificationResult ? classifyVerification(initialVerificationResult) : "ready");
  const [result, setResult] = useState<VerificationResult | null>(initialVerificationResult ?? null);
  const [completed, setCompleted] = useState<string[]>(initialCompletedTaskIds);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const photoTask = quest.tasks.find((task) => task.verificationRequired);
  const selfReportTasks = quest.tasks.filter((task) => !task.verificationRequired);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  if (!photoTask?.verificationCriterion) return null;
  const photoTaskId = photoTask.id;
  const instruction = photoTask.instruction;
  const verificationCriterion = photoTask.verificationCriterion;

  function clearImage() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setUiState("ready");
    setUploadError(null);
    setInputKey((key) => key + 1);
    onProgress?.(completed, null);
  }

  function selectImage(selected: File | undefined) {
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
      clearImage();
      setUploadError("Choose a JPG, PNG, or WebP photo smaller than 5 MB.");
      return;
    }
    setUploadError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setUiState("ready");
    onProgress?.(completed, null);
  }

  async function verify() {
    if (!file || uiState === "checking") return;
    setUiState("checking");
    setUploadError(null);
    const formData = new FormData();
    formData.set("image", file);
    formData.set("instruction", instruction);
    formData.set("verificationCriterion", verificationCriterion);
    try {
      const response = await fetch("/api/evidence/verify", { method: "POST", body: formData });
      if (!response.ok) throw new Error("verification_failed");
      const parsed = EvidenceVerificationResponseSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error("invalid_verification_response");
      setResult(parsed.data.result);
      setUiState(parsed.data.status);
      onProgress?.(completed, parsed.data.result);
    } catch {
      setResult(null);
      setUiState("error");
    }
  }

  function finish() {
    const evidenceStatus = uiState === "verified" ? "verified" : uiState === "error" ? "verification_unavailable" : "not_verified";
    onComplete(
      createCompletedTaskIds(photoTaskId, completed, evidenceStatus),
      evidenceStatus,
      result ?? undefined,
    );
  }

  const canContinue = uiState === "verified" || uiState === "uncertain" || uiState === "error";

  return <>
    <div className="eyebrow">03 / BRING BACK A LITTLE WONDER</div>
    <h1>You’re back.<br /><span className="serif">What did you find?</span></h1>
    <p className="lede">Show us one thing you discovered.</p>
    <p className="evidence-instruction">{instruction}</p>
    <label className={`upload-card ${preview ? "has-preview" : ""}`}>
      {preview ? <>
        {/* The object URL is an ephemeral browser preview and is revoked on replacement or unmount. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Your selected quest discovery" />
        <span className="preview-label">Change photo</span>
      </> : <><span className="upload-icon" aria-hidden="true">＋</span><strong>Add your discovery</strong><span>Choose one JPG, PNG, or WebP · up to 5 MB</span></>}
      <input key={inputKey} aria-label="Choose a discovery photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={uiState === "checking"} onChange={(event) => selectImage(event.target.files?.[0])} />
    </label>
    {preview && uiState !== "checking" && <button className="text-button" onClick={clearImage}>Remove photo</button>}
    {uploadError && <p role="alert" className="warning">{uploadError}</p>}
    {uiState === "ready" && <button className="button primary" disabled={!file} onClick={verify}>Verify discovery <span aria-hidden="true">↗</span></button>}
    {uiState === "checking" && <button className="button primary" disabled>Checking your discovery… <span aria-hidden="true">↗</span></button>}
    {uiState === "verified" && <div className="verification-result verified" role="status"><strong>✓ Discovery verified</strong><p>{result?.reason}</p></div>}
    {uiState === "uncertain" && <div className="verification-result uncertain" role="status"><strong>Not sure yet</strong><p>This photo doesn’t clearly show enough evidence for the mission.</p><button className="text-button" onClick={clearImage}>Try another photo</button></div>}
    {uiState === "error" && <div className="verification-result error" role="alert"><strong>We couldn’t check that right now.</strong><p>Your quest is safe. You can try again or continue.</p><button className="text-button" onClick={verify}>Try again</button></div>}
    <p className="footnote">SideQuest does not persist this image. It is sent to Google for verification with store:false.</p>
    {canContinue && <>
      <fieldset className="self-report"><legend>What else did you discover?</legend>
        <p className="muted">Check the tasks you completed. It’s okay to skip one.</p>
        {selfReportTasks.map((task) => <label className="check-task" key={task.id}>
          <input type="checkbox" checked={completed.includes(task.id)} onChange={(event) => {
            const next = event.target.checked ? [...completed, task.id] : completed.filter((id) => id !== task.id);
            setCompleted(next);
            onProgress?.(next, result);
          }} />
          <span>{task.instruction}</span>
        </label>)}
      </fieldset>
      <button className="button primary" onClick={finish}>Complete my SideQuest <span aria-hidden="true">↗</span></button>
    </>}
  </>;
}
