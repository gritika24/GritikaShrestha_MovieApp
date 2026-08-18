// ---------------------------------------------------------------------------
// DEMO-GRADE AUTH ONLY.
//
// Accounts and password hashes are stored in the browser's localStorage and
// checked entirely client-side. That means:
//   - Anyone with devtools can read the user list and hashes.
//   - Anyone can edit the JS in the page to skip the login check entirely.
//   - There's no salt, no rate limiting, no session expiry, no HTTPS boundary.
//
// This is fine for prototyping a UI flow. It is NOT how you'd ship real
// auth. For production: move signup/login/CRUD auth checks to a server,
// hash+salt passwords with bcrypt/argon2, issue signed session tokens
// (JWT or server sessions) over HTTPS, and validate every request
// server-side — never trust the client to enforce permissions.
// ---------------------------------------------------------------------------

const USERS_KEY = "now_showing_users";

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// SHA-256 via the browser's SubtleCrypto API. No salt — do not reuse this
// pattern outside a demo.
export async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
