import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../API/auth-actions";
import { Link } from "react-router-dom";
import "./style/RegisterPage.scss";


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
    <div className="authWrap">
      <div className="card authCard">
        <h1 className="authTitle">Créer un compte</h1>
        <p className="authSub">
          Pas de compte ? crées en un 
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <label className="label">Pseudo</label>
            <input
              className="input"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="row">
            <label className="label">Mot de passe</label>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btnPrimary" type="submit">
            Créer un compte
          </button>

          <Link to="/login" className="btn btnSecondary">
            ← Retour à la connexion
          </Link>
        </form>
      </div>
    </div>
  );




}
