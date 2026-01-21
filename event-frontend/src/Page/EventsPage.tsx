import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function EventsPage() {

  const navigate = useNavigate();
  const username = localStorage.getItem("username") ?? "?";
  const [showCreate, setShowCreate] = useState(false);
  

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 

    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  }
  function openCreateEvent() {
    setShowCreate(true);
  }
  function closeCreateEvent() {
    setShowCreate(false);
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>PAGE EVENTS</h2>
      <p>Connecté en tant que : <b>{username}</b></p>

      <button onClick={logout}>Se déconnecter</button>
      <button onClick={openCreateEvent}>Nouvel évenement</button>


      {showCreate && (
        <div
          onClick={closeCreateEvent}
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

            <p>Ici le formulaire</p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={closeCreateEvent}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
