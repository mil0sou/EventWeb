import type { EventItem } from "../../utils/types";

type Props = {
  ev: EventItem;
  username: string;
  onClick: () => void;
};

export default function EventCard({ ev, username, onClick }: Props) {
  return (
    <div className="eventCard" onClick={onClick}>
      <h4 className="eventCardTitle">{ev.title}</h4>

      <p className="eventCardDesc">{ev.description}</p>

      <div className="eventCardMeta">
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
            <span className="eventCardMe">(Vous)</span>
          )}
        </div>
      </div>
    </div>
  );
}
