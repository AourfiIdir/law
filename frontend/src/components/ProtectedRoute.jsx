import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children, allowRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

