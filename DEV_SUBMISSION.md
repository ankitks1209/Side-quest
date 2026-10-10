---
title: "SideQuest: An AI App Designed to Make You Stop Using It"
published: false
tags: devchallenge, hf26challenge, gemma, webdev
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).*

Most apps count success in time on screen. SideQuest is designed around the moment you put your phone away.

Its job is to give you a reason to step outside, then get out of the way.

“Touch grass” is easy advice. It leaves one practical question unanswered: what do I do when I get outside?

## What I Built

**SideQuest** gives you a small mission. Choose how much time you have, how you feel and the kind of place you're in. Gemma turns those choices into two or three things to notice. Then the app tells you to put your phone away.

It's for someone with a spare fifteen minutes who wants a reason to step out without planning a route or turning a walk into a workout. A quest can ask you to notice a color, compare patterns or listen to your surroundings. You don't need a destination. You need somewhere safe to pause and pay attention.

**The world is the interface.** The five screens are Landing, Quest Setup, Quest, Evidence and Completion. The quiet active state is part of Quest and says, “We'll be here when you're back.” There is no conversation to keep answering outside.

When you return, one photo is checked against one mission criterion. The other discoveries are self-reported. Completion shows a receipt of what counted and an estimate of time away from SideQuest. There is no feed or streak to maintain: the next interesting thing is outside.

## Demo

[Try SideQuest on Render](https://side-quest-ai.onrender.com).

Choose **15 minutes → Explore → City**, read the generated quest and tap **Begin SideQuest**. Return with one photo, mark the tasks you actually completed and finish. The full flow needs no account, map or GPS.

The deployed app is the demo. Hosted AI requires internet and provider availability; generation can return a clearly labeled backup quest. Photo uncertainty or a technical failure still lets you finish, without counting that discovery.

**Latest live check (October 11):** Gemma quest generation worked. Photo verification was unavailable for synthetic test images, including a later retry. The app allows completion without counting an unverified photo; earlier successful verification tests below are historical technical results.

## Code

[SideQuest repository](https://github.com/ankitks1209/Side-quest)

The README covers setup, model boundaries, privacy and Render deployment. The contracts, decisions and test records remain in the repository so the behavior is inspectable. The application currently has no LICENSE file; public source access is separate from Gemma's open-weight status.

## How I Built It

SideQuest is one Next.js application with strict TypeScript, Tailwind and Zod. React state handles the flow. localStorage saves setup preferences and one recoverable active session. Render serves the UI and two server API routes; Google hosts inference.

The quest adapter defaults to **Gemma 4 26B**, hosted as `gemma-4-26b-a4b-it` through Google's Interactions API. Its job is to write structured quests from the selected duration, mood and environment.

I constrained it to eight primitives: photograph an object, find nature, observe a pattern, observe a color, compare, listen, walk for a duration and reflect. Every quest must contain two or three tasks and exactly one photo task. Those limits keep a quest small enough to remember when the phone goes away.

The photo verifier defaults to **Gemini 3.7 Flash** (`gemini-3.7-flash`). It is a proprietary verifier, not the open-weight quest engine. It receives one image and one criterion. Uploads must be JPEG, PNG or WebP up to 5 MB, with matching MIME and byte signatures. A validated `verified: true` result counts only at confidence ≥ 0.75. Uncertain results don't retry automatically; technical failures retry once. Either can finish without counting the photo.

The October 11 checks pass **119 tests**, lint, strict typecheck and a production build. Coverage includes generation approval and fallback, upload validation, verification classification, visibility math and recovery. These checks establish application behavior; they do not establish outdoor effectiveness.

I used Codex during implementation and documentation preparation. Its proposed changes still had to fit the project contracts and pass the checks.

## Why Does Open Innovation Matter?

Gemma writes the mission itself, so open weights underpin the essential creative work. Hosted inference is convenient for this demo, but the same model family can be deployed elsewhere and adapted without being limited to a single proprietary reasoning service. That is the value of openness here: a path to controlling the mission-generating model, not a claimed benchmark win.

I separated generation behind a small `QuestModel` interface. The provider handles transport; the app owns schemas and safety. Another Gemma deployment could send candidates through the same approval pipeline without owning the product rules.

I haven't fine-tuned or inspected the weights, shipped local inference, or established a cost or accuracy advantage over a closed model. The AI steps need internet, and Gemini remains a proprietary verifier. The replaceable boundary is implemented; alternative hosting is a future option.

SideQuest does not persist uploaded evidence images. They are sent to Google for verification with `store: false`. Both model requests disable Interaction storage; that is not a promise of zero retention under every provider policy.

## What I Tested—and What Remains Unproven

The recorded live generation test returned an approved quest with exactly one photo task. For verification, a synthetic green/yellow checkerboard was accepted at 0.99 confidence, an unrelated gray image was uncertain, and a JPEG declared as PNG was rejected. Those were technical tests, not discoveries made outside.

The mobile acceptance run also completed an uncertain photo without counting it and recovered task progress after refresh without restoring the image. That matters because a walk should not become a hostage to an upload or a reloaded page.

I have no completed outdoor field-test results to report. Whether the tasks feel memorable outside, how reliably real discovery photos match their criteria, and whether people actually spend less time on their phones remain unproven. SideQuest is designed for that outcome; a hidden tab alone cannot establish it.

## The Away Ratio

Timing begins at **Begin SideQuest** and ends at Completion, including evidence interaction. Visible document segments accumulate as `activeScreenMs`. The remaining elapsed time is estimated away:

```text
estimatedAwayMs = max(0, totalDurationMs - clampedActiveScreenMs)
awayRatio = estimatedAwayMs / totalDurationMs
```

Zero-duration sessions return zero; elapsed time isn't capped at the selected quest duration.

Away Ratio estimates how much of your quest was spent away from SideQuest based on app visibility. It does not measure device-wide screen time. A hidden tab might mean another app, not a walk. The ratio is a reflection on the session, not proof of outdoor activity.

Refresh recovery restores progress without the image. It discards an interrupted visible segment because the browser cannot tell us how long the old page remained visible afterward. That avoids inventing visible time, but can overestimate away time after an interruption. It is another reason to call the number an estimate.

## Safety

**AI proposes; deterministic application code decides what SideQuest accepts.**

```text
Preferences → Gemma → raw structured output → JSON extraction
→ Zod schema / approved primitives → input compatibility
→ deterministic safety validation → approved Quest
```

The rules block specified hazards including trespassing, rail tracks, unsafe traffic, construction zones, unsafe heights, water entry, wildlife handling, unknown plant/fungi consumption and dangerous night exploration. Rejected output or provider failure gets one retry, then a curated fallback passes the same approval boundary. A backup quest is disclosed in the UI.

This is a tested rule-based filter, not a complete understanding of language or the user's surroundings. Users must skip anything unsafe. Photo verification checks visible content; it cannot prove where or when a photo was taken.

## What Didn't Work

Early provider requests exceeded the original synchronous latency budget. They exercised the two-failure fallback path. Setting Gemma's thinking level to `minimal` for constrained quest JSON then produced a successful live response. The record is in the repository’s TESTING.md; this is a reliability decision, not a general claim that less reasoning is better.

Photo verification also needed an escape path. A third-party model can be uncertain or unavailable. Completion therefore stays reachable, while an unverified photo never silently counts as a discovery.

Finally, browser visibility couldn't give me physical-world sensing. Rather than rename it “screen time,” I kept the measurement narrow and disclosed its limits on the completion receipt.

The design lesson was to make uncertainty visible without turning it into a dead end. An AI model writes the invitation; the app owns the rules, and the user can always decline an unsafe task.

## Prize Categories

- **Best Use of Gemma:** Gemma 4 26B generates structured outdoor quests, with app-side validation, one retry and a disclosed curated fallback.
- **Best Use of Render:** One Render Node Web Service hosts the complete Next.js experience and server API routes. Google runs inference.
