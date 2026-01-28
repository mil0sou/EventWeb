import "../style/EventsPage.scss";
import EventForm from "./EventForm";

type Props = {
  isOpen: boolean;
  username: string;

  title: string;
  description: string;
  eventDate: string;
  capacity: number;

  formError: string | null;
  saving: boolean;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setEventDate: (v: string) => void;
  setCapacity: (v: number) => void;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CreateEventModal({
  isOpen,
  title,
  description,
  eventDate,
  capacity,
  saving,
  setTitle,
  setDescription,
  setEventDate,
  setCapacity,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
  <div className="modalOverlay" onClick={onClose}>
    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
      <h3 style={{ marginTop: 0 }}>Créer un événement</h3>

        <EventForm
        title={title}
        description={description}
        date={eventDate}
        capacity={capacity}
        setTitle={setTitle}
        setDescription={setDescription}
        setDate={setEventDate}
        setCapacity={setCapacity}
        onSubmit={onSubmit}
        onCancel={onClose}
        submitLabel={saving ? "Création..." : "Créer"}
        cancelLabel="Fermer"
        disabled={saving}
        />

      </div>
    </div>
  );
}
