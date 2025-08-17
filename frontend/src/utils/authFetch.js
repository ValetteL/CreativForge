// Always include cookies and JSON headers for API calls.
// Throws on 401 so callers can handle re-login flows if needed.
export async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include", // send HttpOnly cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    // Optionally: dispatch a global logout or show a toast.
    throw new Error("Unauthorized (session expired or not signed in).");
  }
  return res;
}
