import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role || "user";
    },
  });
  return { role, roleLoading };
};

export default useRole;
