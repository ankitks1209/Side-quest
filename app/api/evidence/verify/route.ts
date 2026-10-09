import { GoogleVisionVerifier } from "@/lib/ai/google-vision-verifier";
import { EvidenceUploadError, validateEvidenceFormData } from "@/lib/evidence/upload";
import { verifyEvidence } from "@/lib/evidence/verification";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "Choose a valid image and try again." }, { status: 400 });
  }

  let input;
  try {
    input = await validateEvidenceFormData(formData);
  } catch (error) {
    if (error instanceof EvidenceUploadError) {
      return Response.json({ message: "Choose a JPG, PNG, or WebP photo smaller than 5 MB." }, { status: 400 });
    }
    return Response.json({ message: "Choose a valid image and try again." }, { status: 400 });
  }

  try {
    return Response.json(await verifyEvidence(input, new GoogleVisionVerifier()));
  } catch {
    return Response.json({ message: "We couldn’t check that right now." }, { status: 503 });
  }
}
