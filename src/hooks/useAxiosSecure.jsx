import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // intercept request — attach a fresh Firebase ID token
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user?.getIdToken) {
          try {
            const token = await user.getIdToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
          } catch {
            // fall back to any cached token on the user object
            const cached =
              user?.accessToken || user?.stsTokenManager?.accessToken;
            if (cached) config.headers.Authorization = `Bearer ${cached}`;
          }
        }
        return config;
      },
    );

    // interceptor response
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const statusCode = error?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          signOutUser?.().then(() => {
            navigate("/login");
          });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
