import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../API/auth-actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = await login(username, password);
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/events", { replace: true });

  }

  
  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>

      <p>
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </form>
  );
}








