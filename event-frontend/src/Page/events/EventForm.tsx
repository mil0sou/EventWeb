type Props = {
  title: string;
  description: string;
  date: string;
  capacity: number;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setDate: (v: string) => void;
  setCapacity: (v: number) => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;

  submitLabel: string;      // "Créer" ou "Enregistrer"
  cancelLabel?: string;     // défaut "Annuler"
  disabled?: boolean;       // saving / detailsLoading
};

export default function EventForm({
  title,
  description,
  date,
  capacity,
  setTitle,
  setDescription,
  setDate,
  setCapacity,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Annuler",
  disabled = false,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="eventForm">


    <input
    className="formInput"
    value={title}
    placeholder="Titre"
    onChange={(e) => setTitle(e.target.value)}
    />

    <textarea
    className="formTextarea"
    value={description}
    placeholder="Description"
    rows={4}
    onChange={(e) => setDescription(e.target.value)}
    />

    <input
    className="formInput"
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    />

    <input
    className="formInput"
    type="number"
    min={1}
    value={capacity}
    onChange={(e) => setCapacity(Number(e.target.value))}
    />




      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" className="btn btnSecondary" onClick={onCancel} disabled={disabled}>
          {cancelLabel}
        </button>

        <button type="submit" className="btn btnSecondary" disabled={disabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}




