import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { login } from "../API/auth-actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  try {
    const token = await login(username, password);

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/events", { replace: true });
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Identifiants invalides"
    );
  }
}

  
  return (
    <form onSubmit={handleSubmit}>
    <input
      value={username}
      autoComplete="username"
      onChange={(e) => {
        setUsername(e.target.value);
        setError(null);
      }}
    />

    <input
      type="password"
      value={password}
      autoComplete="current-password"
      onChange={(e) => {
        setPassword(e.target.value);
        setError(null);
      }}
    />
      <button type="submit">Se connecter</button>

      <p>
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
      {error && (
        <p style={{ color: "crimson", marginTop: 10 }}>
          {error}
        </p>
      )}
    </form>
  );
}








