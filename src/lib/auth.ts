import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin-token";
const TOKEN_EXPIRY = "24h";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

// ── Password ────────────────────────────────────────────────────

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  // Constant-time comparison to prevent timing attacks
  if (input.length !== expected.length) return false;

  const a = new TextEncoder().encode(input);
  const b = new TextEncoder().encode(expected);

  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ b[i];
  }
  return mismatch === 0;
}

// ── JWT ─────────────────────────────────────────────────────────

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

// ── Cookie helpers ──────────────────────────────────────────────

export { COOKIE_NAME };

export function buildCookieHeader(token: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24}`, // 24h
  ];
  if (isProduction) parts.push("Secure");
  return parts.join("; ");
}

export function buildLogoutCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
