import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents, createEvent, getEventDetails, registerEvent, unregisterEvent, deleteEventById,updateEventById,getParticipants    } from "../API/events-actions.ts";
import type { EventItem } from "../utils/types";
import "./style/EventsPage.scss";


export default function EventsPage() {

  const navigate = useNavigate();
  const username = localStorage.getItem("username") ?? "?";
  const [showCreate, setShowCreate] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCapacity, setEditCapacity] = useState(1);
  const [participants, setParticipants] = useState<{ id: number; username: string }[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);



  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 

    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  }
  function openCreateEvent() {
    setShowCreate(true);
  }
  function closeCreateEvent() {
    setShowCreate(false);
  }
  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) return setFormError("Titre obligatoire");
    if (!cleanDesc) return setFormError("Description obligatoire");
    if (!eventDate) return setFormError("Date obligatoire");
    if (!Number.isInteger(capacity) || capacity <= 0) return setFormError("Capacité invalide");

    try {
      setSaving(true);
      await createEvent({
        title: cleanTitle,
        description: cleanDesc,
        event_date: eventDate, // input type=date => "YYYY-MM-DD"
        capacity,
      });

      // recharge la liste (simple)
      const data = await getEvents();
      setEvents(data);

      // reset + fermer
      setTitle("");
      setDescription("");
      setEventDate("");
      setCapacity(1);
      closeCreateEvent();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }
  async function openEventDetails(ev: EventItem) {
    setSelectedEvent(ev);
    setShowDetails(true);

    setRemaining(null);
    setIsRegistered(false);
    setDetailsError(null);
    setDetailsLoading(true);

    try {
      const full = await getEventDetails(ev.id);
      setParticipantsLoading(true);
      try {
        const ppl = await getParticipants(ev.id);
        setParticipants(ppl);
      } finally {
        setParticipantsLoading(false);
      }
      // on met à jour l’event sélectionné avec les champs complets
      setSelectedEvent(full);
      setEditTitle(full.title);
      setEditDescription(full.description);
      setEditDate(full.event_date.slice(0, 10));
      setEditCapacity(full.capacity);
      setIsEditing(false);

      setRemaining(full.remaining ?? null);
      setIsRegistered(!!full.isRegistered);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDetailsLoading(false);
    }
  }
  function closeEventDetails() {
    setShowDetails(false);
    setSelectedEvent(null);
  }
  async function handleUpdateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      setDetailsLoading(true);
      setDetailsError(null);

      await updateEventById(selectedEvent.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        event_date: editDate,
        capacity: editCapacity,
      });

      const full = await getEventDetails(selectedEvent.id);
      setSelectedEvent(full);
      setRemaining(full.remaining ?? null);
      setIsRegistered(!!full.isRegistered);

      const data = await getEvents();
      setEvents(data);

      setIsEditing(false);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDetailsLoading(false);
    }
  }

return (
  <div className="eventsWrap">
    <div className="eventsTop">
      <div>
        <h1 className="eventsTitle">Événements</h1>
        <p className="eventsSub">
          Connecté en tant que : <b>{username}</b>
        </p>
      </div>

      <div className="eventsActions">
        <button className="btn btnSecondary" onClick={logout}>Se déconnecter</button>
        <button className="btn btnPrimary" onClick={openCreateEvent}>Nouvel événement</button>
      </div>
    </div>

    <div className="divider" />



      <hr style={{ margin: "16px 0" }} />

      <h3>Événements</h3>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && events.length === 0 && <p>Aucun événement.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {events.map((ev) => (
          <div
            key={ev.id}
            onClick={() => openEventDetails(ev)}
            
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              padding: 12,
              cursor: "pointer",

            }}
          >
            <h4 style={{ margin: "0 0 6px 0" }}>{ev.title}</h4>
            <p style={{ margin: "0 0 6px 0", opacity: 0.9 }}>{ev.description}</p>

            <div style={{ display: "grid", gap: 4, opacity: 0.9 }}>
              <div><b>Date:</b> {ev.event_date.slice(0, 10)}</div>
              <div><b>Capacité:</b> {ev.capacity}</div>

              <div>
                <b>Organisateur:</b>{" "}
                {ev.organizer}
                {ev.organizer === username && (
                  <span style={{ marginLeft: 6, color: "gold" }}>
                    (Vous)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div
          onClick={closeCreateEvent}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgb(24, 24, 24)",
              borderRadius: 12,
              padding: 16,
              width: "min(420px, 100%)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Créer un événement</h3>

            <form onSubmit={handleCreateEvent} style={{ display: "grid", gap: 10 }}>
              <input
                value={title}
                placeholder="Titre"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFormError(null);
                }}
              />

              <textarea
                value={description}
                placeholder="Description"
                rows={4}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFormError(null);
                }}
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => {
                  setEventDate(e.target.value);
                  setFormError(null);
                }}
              />

              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => {
                  setCapacity(Number(e.target.value));
                  setFormError(null);
                }}
              />

              {/* organizer affiché (info) */}
              <p style={{ margin: 0, opacity: 0.8 }}>
                Organisateur : <b>{username}</b>
              </p>

              {formError && <p style={{ color: "crimson", margin: 0 }}>{formError}</p>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={closeCreateEvent} disabled={saving}>
                  Fermer
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Création..." : "Créer"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {showDetails && selectedEvent && (
        <div
        onClick={closeEventDetails}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgb(24, 24, 24)",
            borderRadius: 12,
            padding: 16,
            width: "min(520px, 100%)",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{selectedEvent.title}</h3>
          {!isEditing ? (
            <>
              <p style={{ opacity: 0.9 }}>{selectedEvent.description}</p>

              <div style={{ display: "grid", gap: 6, opacity: 0.9, marginTop: 12 }}>
                <div><b>Date:</b> {selectedEvent.event_date.slice(0, 10)}</div>
                <div><b>Capacité:</b> {selectedEvent.capacity}</div>
                <div><b>Places restantes:</b> {remaining}</div>
                <div>
                  <b>Organisateur:</b> {selectedEvent.organizer}
                </div>

                
                <div>
                  <b>Participants</b>

                  {participantsLoading ? (
                    <p style={{ opacity: 0.7 }}>Chargement...</p>
                  ) : participants.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>Aucun participant</p>
                  ) : (
                    <ul style={{ margin: "6px 0 0 16px" }}>
                      {participants.map((p) => (
                        <li key={p.id}>
                          {p.username}
                          {p.username === username && (
                            <span style={{ opacity: 0.6 }}> (toi)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateEvent} style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <textarea
                value={editDescription}
                rows={4}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              <input
                type="number"
                min={1}
                value={editCapacity}
                onChange={(e) => setEditCapacity(Number(e.target.value))}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
                <button type="submit" disabled={detailsLoading}>
                  Enregistrer
                </button>
              </div>
            </form>
          )}


          {detailsError && (
            <p style={{ color: "crimson", marginTop: 10 }}>{detailsError}</p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 16 }}>
            {/* modifier : grisé si pas l'admin */}
            {selectedEvent.organizer === username && !isEditing && (
              <button className="btn btnSecondary" onClick={() => setIsEditing(true)}>
                Modifier
              </button>
            )}

            {/* Supprimer : grisé si pas l'admin */}
            {selectedEvent.organizer === username && (
              <button
                className="btn btnDanger"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!selectedEvent) return;

                  try {
                    setDetailsLoading(true);
                    setDetailsError(null);

                    await deleteEventById(selectedEvent.id);

                    // Fermer la modale + refresh liste
                    closeEventDetails();
                    const data = await getEvents();
                    setEvents(data);
                  } catch (err) {
                    setDetailsError(err instanceof Error ? err.message : "Erreur");
                  } finally {
                    setDetailsLoading(false);
                  }
                }}
              >
                Supprimer
              </button>
            )}


            <div style={{ display: "flex", gap: 8 }}>
              {/* Inscription toggle */}
              <button className="btn btnPrimary"
              onClick={async (e) => {
                e.stopPropagation();
                if (!selectedEvent) return;

                try {
                  setDetailsLoading(true);
                  setDetailsError(null);

                  if (isRegistered) {
                    await unregisterEvent(selectedEvent.id);
                    const ppl = await getParticipants(selectedEvent.id);
                    setParticipants(ppl);
                  } else {
                    await registerEvent(selectedEvent.id);
                    const ppl = await getParticipants(selectedEvent.id);
                    setParticipants(ppl);
                  }

                  // Recharger détails (remaining + isRegistered)
                  const full = await getEventDetails(selectedEvent.id);
                  setSelectedEvent(full);
                  setRemaining(full.remaining ?? null);
                  setIsRegistered(!!full.isRegistered);

                  // Optionnel: refresh la liste aussi
                  const data = await getEvents();
                  setEvents(data);
                } catch (err) {
                  setDetailsError(err instanceof Error ? err.message : "Erreur");
                } finally {
                  setDetailsLoading(false);
                }
              }}

                disabled={detailsLoading}
              >
                {isRegistered ? "Désinscrire" : "S'inscrire"}
              </button>

              <button className="btn btnGhost" onClick={closeEventDetails}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
