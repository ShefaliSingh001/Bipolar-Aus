import { base44 } from "@/api/base44Client";

// Signs the user out and returns them to a clean URL.
// Stripping the query string matters: a lingering `access_token`/`from_url`
// param in the URL is picked back up on reload and silently re-authenticates.
export default function signOut(path = "/") {
  localStorage.removeItem("admin_session");
  base44.auth.logout(`${window.location.origin}${path}`);
}