import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        console.log("Making request to check admin status...");
        const res = await axios.get("/api/v1/auth/admin-auth");
        
        console.log("Response from /user-admin API:", res.data);

        if (res.data.ok) {
          setOk(true);
          console.log("Admin check passed. User is an admin.");
        } else {
          setOk(false);
          console.log("Admin check failed. User is not an admin.");
        }
      } catch (error) {
        console.error("Error occurred during auth check:", error);
        setOk(false);
      }
    };

    console.log("Checking auth token...");
    if (auth?.token) {
      console.log("Token found. Proceeding with admin check.");
      authCheck();
    } else {
      console.log("No token found. Admin check skipped.");
      setOk(false);
    }
  }, [auth?.token]);

  if (!auth?.token) {
    console.log("No auth token. Showing Spinner.");
    return <Spinner />;
  }

  console.log("Auth token found. Rendering Outlet.");
  return ok ? <Outlet /> : <Spinner />;
}
