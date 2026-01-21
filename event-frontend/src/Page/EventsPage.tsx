import { useNavigate } from "react-router-dom";

export default function EventsPage() {

  const navigate = useNavigate();
  const username = localStorage.getItem("username") ?? "?";
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 

    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>PAGE EVENTS</h2>
      <p>Connecté en tant que :<b>{username}</b></p>

      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
