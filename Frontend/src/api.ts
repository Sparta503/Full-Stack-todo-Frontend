const API_URL = "http://127.0.0.1:8000";

export async function register(username: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json() as Promise<{ token: string }>;
}

export async function getProtected(token: string) {
  const res = await fetch(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
