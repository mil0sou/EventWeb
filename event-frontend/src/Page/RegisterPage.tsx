import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../API/auth-actions";
import { login } from "../API/auth-actions";
import { Link } from "react-router-dom";
import "./style/RegisterPage.scss";
import toast from "react-hot-toast";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  try {

    await register(username, password);
    const token = await login(username, password);

    localStorage.setItem("token", token);
    localStorage.setItem("username", username); 
    window.dispatchEvent(new Event("auth-changed"));
    toast.success("Compte créé", {  className: "toastSuccess", duration: 2000 });
    navigate("/events");
  } catch (err) {
    const e2 = err as Error & { status?: number };

    if (e2.status === 409) {
      setError("Ce nom d’utilisateur est déjà utilisé");
    } else {
      setError(e2.message || "Erreur lors de la création du compte");
    }
  }

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
              required
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
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="formError">{error}</p>}

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
