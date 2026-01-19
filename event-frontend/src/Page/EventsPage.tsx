import { useNavigate } from "react-router-dom";
import type { User } from "../utils/types";

export default function EventsPage({ user }: { user: User }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>PAGE EVENTS</h2>
      <p>Connecté en tant que : <b>{user.username}</b></p>

      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
