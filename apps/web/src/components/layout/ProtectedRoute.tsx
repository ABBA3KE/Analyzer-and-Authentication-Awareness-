import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FullPageSpinner } from "../ui/Spinner";

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: "STUDENT" | "ADMIN" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <FullPageSpinner label="Checking your session" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
