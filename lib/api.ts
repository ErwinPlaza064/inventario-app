const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://inventario-app-production.up.railway.app/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("it_suite_token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Ensure clean URL construction - don't duplicate if already absolute
  let url: string;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    url = endpoint; // Already a full URL
  } else {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    url = `${API_URL}${cleanEndpoint}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("it_suite_token");
      window.location.href = "/login";
    }
  }

  return response;
}
