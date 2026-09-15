import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext/AuthContext";
import useRole from "../hooks/useRole";
import Loading from "../components/common/Loading";
import useAxiosSecure from "../hooks/useAxiosSecure";

// Guards a route. Requires an authenticated user; optionally requires a role.
// The role gate is loop-safe: if the role is unknown (e.g. backend down) access
// is allowed rather than redirecting in a cycle.
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const { role: userRole, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const isCompletionRoute = location.pathname === "/profile/complete";
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email && !isCompletionRoute,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });

  if (loading) return <Loading label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isCompletionRoute) {
    return children;
  }

  if (profileLoading) {
    return <Loading label="Checking your profile..." />;
  }

  if (profileError || profile?.profileComplete !== true) {
    return (
      <Navigate to="/profile/complete" state={{ from: location }} replace />
    );
  }

  if (role && roleLoading) {
    return <Loading label="Verifying access..." />;
  }

  const knownRole = userRole === "teacher" || userRole === "student";
  if (role && knownRole && userRole !== role) {
    const target =
      userRole === "teacher" ? "/profile/teacher" : "/profile/student";
    return <Navigate to={target} replace />;
  }

  return children;
};

export default PrivateRoute;
