import type { EventItem } from "../utils/types";

export async function getEvents(): Promise<EventItem[]> {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/events", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les événements");
  }

  return res.json();
}

export async function createEvent(payload: {
  title: string;
  description: string;
  event_date: string; // "YYYY-MM-DD"
  capacity: number;
}) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Création impossible");
  }

  return res.json();
}

export async function getEventDetails(id: number): Promise<EventItem> {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/events/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Impossible de charger l'événement");
  }

  return res.json();
}

export async function registerEvent(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/events/${id}/register`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Inscription impossible");
  }
}

export async function unregisterEvent(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/events/${id}/register`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Désinscription impossible");
  }
}

export async function deleteEventById(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/events/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Suppression impossible");
  }
}

export async function updateEventById(
  id: number,
  payload: {
    title: string;
    description: string;
    event_date: string;
    capacity: number;
  }
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error ?? "Modification impossible");
  }
}
