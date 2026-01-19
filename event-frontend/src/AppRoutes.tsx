import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Page/LoginPage";
import RegisterPage from "./Page/RegisterPage"; // si tu l'as
// import EventsPage from "./Page/EventsPage";
// import ProfilePage from "./Page/ProfilePage";

function ProtectedRoute({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: React.ReactNode;
}) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: React.ReactNode;
}) {
  if (isAuth) return <Navigate to="/events" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const isAuth = !!localStorage.getItem("token"); // pas besoin de useMemo ici

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

      {/* Routes protégées (uniquement si connecté) */}
      <Route
        path="/events"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <div>EVENTS ✅</div>
            {/* <EventsPage /> */}
          </ProtectedRoute>
        }
      />

      {/* Exemple d’autre route protégée */}
      {/*
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuth={isAuth}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      */}

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
