import "../style/EventsPage.scss";

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

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            value={title}
            placeholder="Titre"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            value={description}
            placeholder="Description"
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />

          {/* organizer affiché (info) */}
          <p style={{ margin: 0, opacity: 0.8 }}>
            Organisateur : <b>{username}</b>
          </p>

          {formError && <p style={{ color: "crimson", margin: 0 }}>{formError}</p>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              className="btn btnSecondary"
              onClick={onClose}
              disabled={saving}
            >
              Fermer
            </button>

            <button type="submit" className="btn btnSecondary" disabled={saving}>
              {saving ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
