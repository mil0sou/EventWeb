import type { EventItem } from "../../utils/types";
import EventCard from "./EventCard";

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
  return (
    <>
      <h3>Événements</h3>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && events.length === 0 && <p>Aucun événement.</p>}

      {!loading && !error && events.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {events.map((ev) => (
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
