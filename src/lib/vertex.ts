import { VertexAI } from "@google-cloud/vertexai";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "carta-496507";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

let _client: VertexAI | null = null;

export function getVertexAI(): VertexAI {
  if (_client) return _client;

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

  if (clientEmail && privateKeyRaw) {
    // Vercel preserves newlines, but the legacy `\n`-escaped pattern is also handled
    // for compatibility with platforms that flatten newlines.
    const privateKey = privateKeyRaw.includes("\\n")
      ? privateKeyRaw.replace(/\\n/g, "\n")
      : privateKeyRaw;
    _client = new VertexAI({
      project: PROJECT,
      location: LOCATION,
      googleAuthOptions: {
        credentials: {
          client_email: clientEmail,
          private_key: privateKey
        }
      }
    });
    return _client;
  }

  // Fall back to ADC (works locally when GOOGLE_APPLICATION_CREDENTIALS is set).
  _client = new VertexAI({ project: PROJECT, location: LOCATION });
  return _client;
}
