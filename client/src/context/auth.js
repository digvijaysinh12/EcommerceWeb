import { useState, useEffect, useContext, createContext } from "react";
import axios  from "axios";
// Create the Auth Context
const authContext = createContext();

// AuthProvider component to provide auth state
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

// Default axios
axios.defaults.headers.common['Authorization'] = auth?.token
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslink-disable-next-line
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <authContext.Provider value={[auth, setAuth]}>
      {children}
    </authContext.Provider>
  );
};

// Custom hook to use the auth context
const useAuth = () => useContext(authContext);

export { useAuth, AuthProvider };
