import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${encodeURIComponent(user.email)}/role`,
      );
      return res.data?.role || "user";
    },
  });
  return { role: role || "user", roleLoading };
};

export default useRole;
