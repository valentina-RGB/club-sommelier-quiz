import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { clearAuthStorage, getAuthStorage } from "../storage/permission-store";

interface JWTPayload {
    exp: number;
    [key: string]: any;
  }
export const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = getAuthStorage();
    if (!token) return;

    try {
      const { exp } = jwtDecode<JWTPayload>(token);
      const now = Date.now() / 1000;
      const timeUntilLogout = (exp - now) * 1000;

      if (timeUntilLogout <= 0) {
        clearAuthStorage();
        navigate("/", { replace: true });
        return;
      }

      const timeout = setTimeout(() => {
        clearAuthStorage();
        toast.success("Sesión cerrada, te invitamos a iniciar sesión");
        navigate("/", { replace: true });
      }, timeUntilLogout);

     
      return () => clearTimeout(timeout); 
    } catch (err) {
      clearAuthStorage();
      navigate("/", { replace: true });
    }
  }, []);
};