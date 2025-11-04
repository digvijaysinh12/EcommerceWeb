import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_URL;
        console.log("Checking user auth at:", `${baseURL}/api/v1/auth/user-auth`);

        const res = await axios.get(`${baseURL}/api/v1/auth/user-auth`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        if (res.data.ok) {
          setOk(true);
          console.log("✅ User authenticated");
        } else {
          setOk(false);
          console.log("❌ User authentication failed");
        }
      } catch (error) {
        console.error("Error in user auth check:", error);
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
