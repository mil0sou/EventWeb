import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import LoginPage from "./Page/LoginPage";
import RegisterPage from "./Page/RegisterPage"; // si tu l'as
import EventsPage from "./Page/EventsPage";
// import ProfilePage from "./Page/ProfilePage";

function ProtectedRoute({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: ReactNode;
}) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: ReactNode;
}) {
  if (isAuth) return <Navigate to="/events" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("token"));
  useEffect(() => {
    const syncAuth = () => setIsAuth(!!localStorage.getItem("token"));

    // Si token modifié dans un autre onglet
    window.addEventListener("storage", syncAuth);

    // Si token modifié dans le même onglet (on déclenche nous-mêmes l’event)
    window.addEventListener("auth-changed", syncAuth as EventListener);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth as EventListener);
    };
  }, []);


  return (
    <Routes>
      {/* page par défaut */}
      <Route
        path="/"
        element={<Navigate to={isAuth ? "/events" : "/login"} replace />}
      />

      {/* Routes publiques (uniquement si PAS connecté) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute isAuth={isAuth}>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute isAuth={isAuth}>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <EventsPage user={{ id: "1", username: "test" }} />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
