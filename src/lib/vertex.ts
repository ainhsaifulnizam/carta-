import { VertexAI } from "@google-cloud/vertexai";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "carta-496507";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

let _client: VertexAI | null = null;

function decodeServiceAccount(): { client_email: string; private_key: string } | null {
  // Preferred: a single base64-encoded service account JSON (avoids Vercel's
  // secret-detection heuristics that can block deploys when a raw PEM key is
  // stored in an env var).
  const b64 = process.env.GCP_SA_B64;
  if (b64) {
    try {
      const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
      if (json.client_email && json.private_key) {
        return { client_email: json.client_email, private_key: json.private_key };
      }
    } catch {
      // fall through to other strategies
    }
  }

  // Alternate: a single raw JSON env var.
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (raw) {
    try {
      const json = JSON.parse(raw);
      if (json.client_email && json.private_key) {
        return { client_email: json.client_email, private_key: json.private_key };
      }
    } catch {
      // fall through
    }
  }

  // Fallback: legacy separated env vars.
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  if (clientEmail && privateKeyRaw) {
    const private_key = privateKeyRaw.includes("\\n")
      ? privateKeyRaw.replace(/\\n/g, "\n")
      : privateKeyRaw;
    return { client_email: clientEmail, private_key };
  }
  return null;
}

export function getVertexAI(): VertexAI {
  if (_client) return _client;

  const credentials = decodeServiceAccount();
  if (credentials) {
    _client = new VertexAI({
      project: PROJECT,
      location: LOCATION,
      googleAuthOptions: { credentials }
    });
    return _client;
  }

  // Final fallback: rely on ADC (works locally when GOOGLE_APPLICATION_CREDENTIALS
  // points to a JSON file).
  _client = new VertexAI({ project: PROJECT, location: LOCATION });
  return _client;
}
