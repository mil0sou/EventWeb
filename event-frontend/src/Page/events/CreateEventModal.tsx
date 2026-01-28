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
  username,
  title,
  description,
  eventDate,
  capacity,
  formError,
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
    <div
      onClick={onClose}
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
