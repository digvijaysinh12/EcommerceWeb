import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_URL;
        console.log("Making request to:", `${baseURL}/api/v1/auth/admin-auth`);

        const res = await axios.get(`${baseURL}/api/v1/auth/admin-auth`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        if (res.data.ok) {
          setOk(true);
          console.log("✅ Admin verified");
        } else {
          setOk(false);
          console.log("❌ Admin verification failed");
        }
      } catch (error) {
        console.error("Error in admin auth check:", error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  if (!auth?.token) return <Spinner />;
  return ok ? <Outlet /> : <Spinner />;
}
