import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../API/auth-actions";
import "./style/LoginPage.scss";

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
  <div className="authWrap">
    <div className="card authCard">
      <h1 className="authTitle">Connexion</h1>
      <p className="authSub">Connecte toi pr t'inscrire et créer des évenements</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label className="label" htmlFor="username">Nom d’utilisateur</label>
          <input
            id="username"
            className="input"
            value={username}
            autoComplete="username"
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
          />
        </div>

        <div className="row">
          <label className="label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
        </div>

        <button className="btn btnPrimary" type="submit">
          Se connecter
        </button>

        <Link to="/register" className="btn btnSecondary">
          Créer un compte
        </Link>

        
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  </div>
);



  }








