import type { EventItem } from "../../utils/types";

type Props = {
  ev: EventItem;
  username: string;
  onClick: () => void;
};

export default function EventCard({ ev, username, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #333",
        borderRadius: 12,
        padding: 12,
        cursor: "pointer",
      }}
    >
      <h4 style={{ margin: "0 0 6px 0" }}>{ev.title}</h4>

      <p style={{ margin: "0 0 6px 0", opacity: 0.9 }}>
        {ev.description}
      </p>

      <div style={{ display: "grid", gap: 4, opacity: 0.9 }}>
        <div>
          <b>Date:</b> {ev.event_date.slice(0, 10)}
        </div>

        <div>
          <b>Capacité:</b> {ev.capacity}
        </div>

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
  );
}
