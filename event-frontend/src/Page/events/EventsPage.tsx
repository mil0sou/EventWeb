import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  getEventDetails,
  registerEvent,
  unregisterEvent,
  deleteEventById,
  updateEventById,
  getParticipants,
} from "../../API/events-actions.ts";
import type { EventItem } from "../../utils/types";
import "../style/EventsPage.scss";
import toast from "react-hot-toast";

// composants
import EventsList from "./EventsList";
import CreateEventModal from "./CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";

export default function EventsPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") ?? "?";

  // UI state
  const [showCreate, setShowCreate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // list state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // details state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // edit state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCapacity, setEditCapacity] = useState(1);

  // participants state
  const [participants, setParticipants] = useState<
    { id: number; username: string }[]
  >([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);


  const registeredCount =
    selectedEvent && remaining !== null
      ? selectedEvent.capacity - remaining
      : 0;



  // load list
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

  async function refreshEvents() {
    const data = await getEvents();
    setEvents(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("auth-changed"));
    toast.success("Déconnecté", {  className: "toastSuccess", duration: 2000 });
    navigate("/login");
  }

  function openCreateEvent() {
    setShowCreate(true);
  }
  function closeCreateEvent() {
    setShowCreate(false);
    setFormError(null);
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) return setFormError("Titre obligatoire");
    if (!cleanDesc) return setFormError("Description obligatoire");
    if (!eventDate) return setFormError("Date obligatoire");
    if (!Number.isInteger(capacity) || capacity <= 0)
      return setFormError("Capacité invalide");

    try {
      setSaving(true);
      await createEvent({
        title: cleanTitle,
        description: cleanDesc,
        event_date: eventDate,
        capacity,
      }); 
      toast.success("Événement créé", {  className: "toastSuccess", duration: 2000 });
      await refreshEvents();

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
  // reset état avant chargement
  setDetailsError(null);
  setDetailsLoading(true);
  setParticipantsLoading(true);

  setRemaining(null);
  setIsRegistered(false);
  setIsEditing(false);

  try {
    // charger tout d'abord
    const full = await getEventDetails(ev.id);
    const ppl = await getParticipants(ev.id);

    setSelectedEvent(full);
    setParticipants(ppl);

    setEditTitle(full.title);
    setEditDescription(full.description);
    setEditDate(full.event_date.slice(0, 10));
    setEditCapacity(full.capacity);

    setRemaining(full.remaining ?? null);
    setIsRegistered(!!full.isRegistered);

    setShowDetails(true);
  } catch (err) {
    setDetailsError(err instanceof Error ? err.message : "Erreur");
  } finally {
    setDetailsLoading(false);
    setParticipantsLoading(false);
  }
}


  function closeEventDetails() {
    setShowDetails(false);
    setSelectedEvent(null);
    setIsEditing(false);
    setDetailsError(null);
  }

  async function handleUpdateEvent(e: React.FormEvent) {
    
    e.preventDefault();
    if (!selectedEvent) return;

    const registeredCount =
      remaining !== null
        ? selectedEvent.capacity - remaining
        : 0;

    if (editCapacity < registeredCount) {
      setDetailsError(
        `Impossible de réduire la capacité en dessous de ${registeredCount} inscrits`
      );
      return;
    }
    
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

      await refreshEvents();
      setIsEditing(false);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleDeleteSelectedEvent() {
    if (!selectedEvent) return;

    try {
      setDetailsLoading(true);
      setDetailsError(null);

      await deleteEventById(selectedEvent.id);

      closeEventDetails();
      await refreshEvents();
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : "Erreur");
    } finally {
      toast.success("Event supprimé", {  className: "toastSuccess", duration: 2000 });
      setDetailsLoading(false);
    }
  }

  async function handleToggleRegister() {
    if (!selectedEvent) return;

    try {
      setDetailsLoading(true);
      setDetailsError(null);

      if (isRegistered) {
        await unregisterEvent(selectedEvent.id);
      } else {
        await registerEvent(selectedEvent.id);
      }

      // refresh participants
      const ppl = await getParticipants(selectedEvent.id);
      setParticipants(ppl);

      // refresh details (remaining + isRegistered)
      const full = await getEventDetails(selectedEvent.id);
      setSelectedEvent(full);
      setRemaining(full.remaining ?? null);
      setIsRegistered(!!full.isRegistered);

      // refresh list
      await refreshEvents();
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
          <button className="btn btnSecondary" onClick={logout}>
            Se déconnecter
          </button>
          <button className="btn btnPrimary" onClick={openCreateEvent}>
            Nouvel événement
          </button>
        </div>
      </div>

      <div className="divider" />

      <EventsList
        events={events}
        username={username}
        loading={loading}
        error={error}
        onOpenDetails={openEventDetails}
      />

      <CreateEventModal
        isOpen={showCreate}
        username={username}
        title={title}
        description={description}
        eventDate={eventDate}
        capacity={capacity}
        formError={formError}
        setTitle={setTitle}
        setDescription={setDescription}
        setEventDate={setEventDate}
        setCapacity={setCapacity}
        saving={saving}
        onClose={closeCreateEvent}
        onSubmit={handleCreateEvent}
      />

      <EventDetailsModal
        isOpen={showDetails}
        username={username}
        selectedEvent={selectedEvent}
        remaining={remaining}
        isRegistered={isRegistered}
        detailsLoading={detailsLoading}
        detailsError={detailsError}
        isEditing={isEditing}
        editTitle={editTitle}
        editDescription={editDescription}
        editDate={editDate}
        editCapacity={editCapacity}
        setEditTitle={setEditTitle}
        setEditDescription={setEditDescription}
        setEditDate={setEditDate}
        setEditCapacity={setEditCapacity}
        participants={participants}
        participantsLoading={participantsLoading}
        onClose={closeEventDetails}
        onStartEdit={() => {
          setDetailsError(null);
          setIsEditing(true);
        }}
        onCancelEdit={() => setIsEditing(false)}
        onSubmitEdit={handleUpdateEvent}
        onDelete={handleDeleteSelectedEvent}
        onToggleRegister={handleToggleRegister}
      />
    </div>
  );
}
