import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../API/auth-actions";
import { Link } from "react-router-dom";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = await register(username, password);
    localStorage.setItem("token", token);
    navigate("/events");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Créer un compte</button>
    <p style={{ marginTop: 10 }}>
      <Link to="/login">← Retour à la connexion</Link>
    </p>
  </form>
  );
}
