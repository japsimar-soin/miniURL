const API_BASE = "/api/links";

export async function loadLinks() {
  try {
    const res = await fetch(API_BASE);

    if (!res.ok) return [];

    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createLink(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 409) throw Error("Code already exists");

  if (!res.ok) throw Error("Create failed");

  return res.json();
}

export async function deleteLink(code) {
  const res = await fetch(`${API_BASE}/${code}`, {
    method: "DELETE",
  });

  if (res.status === 404) throw Error("Not found");

  if (res.status !== 204 && !res.ok)
    throw Error("Delete failed");
}

export async function getLinkStats(code) {
  const res = await fetch(`${API_BASE}/${code}`);
  if (res.status === 404) throw Error("Not found");
  if (!res.ok) throw new Error("Not found");

  return res.json();
}
