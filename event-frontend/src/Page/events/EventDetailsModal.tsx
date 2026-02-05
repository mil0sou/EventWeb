import type { EventItem } from "../../utils/types";
import "../style/EventsPage.scss";
import EventForm from "./EventForm";
import { useState } from "react";


type Participant = { id: number; username: string };

type Props = {
  isOpen: boolean;
  username: string;

  selectedEvent: EventItem | null;
  remaining: number | null;
  isRegistered: boolean;

  detailsLoading: boolean;
  detailsError: string | null;

  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editDate: string;
  editCapacity: number;

  setEditTitle: (v: string) => void;
  setEditDescription: (v: string) => void;
  setEditDate: (v: string) => void;
  setEditCapacity: (v: number) => void;

  participants: Participant[];
  participantsLoading: boolean;

  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (e: React.FormEvent) => void;

  onDelete: () => void;
  onToggleRegister: () => void;
};

export default function EventDetailsModal({
  isOpen,
  username,
  selectedEvent,
  remaining,
  isRegistered,
  detailsLoading,
  detailsError,
  isEditing,
  editTitle,
  editDescription,
  editDate,
  editCapacity,
  setEditTitle,
  setEditDescription,
  setEditDate,
  setEditCapacity,
  participants,
  participantsLoading,
  onClose,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onToggleRegister,
}: Props) {
  if (!isOpen || !selectedEvent) return null;
  const isFull = (remaining ?? 0) <= 0;
  const disableRegister = detailsLoading || (!isRegistered && isFull);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3 className="modalTitle">{selectedEvent.title}</h3>
        {!isEditing ? (
          <>
            <p className="eventDetailsDesc">{selectedEvent.description}</p>

            <div className="eventDetailsGrid">
              <div>
                <b>Date:</b> {selectedEvent.event_date.slice(0, 10)}
              </div>

              <div>
                <b>Capacité:</b> {selectedEvent.capacity}
              </div>

              <div>
                <b>Places restantes:</b> {remaining}
              </div>

              <div>
                <b>Organisateur:</b> {selectedEvent.organizer}
              </div>

              <div>
                <b>Participants</b>

                {participantsLoading ? (
                  <p className="muted">Chargement...</p>
                ) : participants.length === 0 ? (
                  <p className="muted">Aucun participant</p>
                ) : (
                  <ul className="participantsList">
                    {participants.map((p) => (
                      <li key={p.id}>
                        {p.username}
                        {p.username === username && (
                          <span className="muted"> (toi)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : (
          <EventForm
            title={editTitle}
            description={editDescription}
            date={editDate}
            capacity={editCapacity}
            setTitle={setEditTitle}
            setDescription={setEditDescription}
            setDate={setEditDate}
            setCapacity={setEditCapacity}
            onSubmit={onSubmitEdit}
            onCancel={onCancelEdit}
            submitLabel="Enregistrer"
            cancelLabel="Annuler"
            disabled={detailsLoading}
          />
        )}

        {detailsError && <p className="errorText">{detailsError}</p>}

        <div className="eventDetailsFooter">
          {/* Modifier : seulement si l'admin */}
          {selectedEvent.organizer === username && !isEditing && (
            <button className="btn btnSecondary" onClick={onStartEdit}>
              Modifier
            </button>
          )}

          {/* Supprimer : seulement si l'admin */}
          {selectedEvent.organizer === username && !isEditing && (
            <button
              className="btn btnDanger"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              disabled={detailsLoading}
            >
              Supprimer
            </button>
          )}

          {/* Actions à droite : seulement hors édition */}
          {!isEditing && (
            <div className="eventDetailsActions">
              {/*<p className="muted">DEBUG remaining: {String(remaining)} / isRegistered: {String(isRegistered)}</p>*/}

              <button
                className="btn btnPrimary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isRegistered && (remaining ?? 0) <= 0) return; // event plein => rien
                  onToggleRegister();
                }}
                disabled={disableRegister}


              >
                {isRegistered ? "Désinscrire" : "S'inscrire"}
              </button>

              <button className="btn btnGhost" onClick={onClose}>
                Fermer
              </button>
            </div>
          )}
        </div>

        {confirmDelete && (
        <div className="modalOverlay" onClick={() => setConfirmDelete(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Suppression</h3>
            <p>Voulez-vous vrm supprimer cet l'événement ?</p>

            <div className="eventDetailsActions">
              <button
                className="btn btnDanger"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
              >
                Supprimer
              </button>

              <button
                className="btn btnGhost"
                onClick={() => setConfirmDelete(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
