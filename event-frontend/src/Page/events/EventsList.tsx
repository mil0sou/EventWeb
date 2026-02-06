import type { EventItem } from "../../utils/types";
import EventCard from "./EventCard";
import { useMemo, useState } from "react";

type Props = {
  events: EventItem[];
  username: string;
  loading: boolean;
  error: string | null;
  onOpenDetails: (ev: EventItem) => void;
};

export default function EventsList({
  events,
  username,
  loading,
  error,
  onOpenDetails,
}: Props) {


  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;

    return events.filter((ev) => {
      const haystack = `${ev.title} ${ev.description}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [events, query]);



  return (
    <>
      <h3>Événements</h3>

      <input
        className="eventsSearch"
        type="text"
        placeholder="Rechercher un événement…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() && (
        <p className="muted">
          {filteredEvents.length} résultat{filteredEvents.length > 1 ? "s" : ""}

        </p>
      )}

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/*!loading && !error && events.length === 0 && <p>Aucun événement.</p>*/}
      {!loading && !error && filteredEvents.length === 0 && <p>Aucun événement.</p>}

      {!loading && !error && filteredEvents.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              ev={ev}
              username={username}
              onClick={() => onOpenDetails(ev)}
            />
          ))}
        </div>
      )}




    </>
  );
}
