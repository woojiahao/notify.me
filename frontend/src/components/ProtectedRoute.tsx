import { PropsWithChildren, useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { defaultUser } from "../models/user";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, isLoading } = useUserContext();
  const location = useLocation();

  // Hack to make it wait for a while while we load from local storage
  useEffect(() => {}, [isLoading]);

  if (!isLoading && user === defaultUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <div>{children}</div>;
}
