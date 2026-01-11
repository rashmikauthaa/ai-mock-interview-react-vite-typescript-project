import { LoaderPage } from "@/routes/loader-page";
import { useAuthContext } from "@/context/auth-context";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoaderPage />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;