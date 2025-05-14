import { useState, useContext, createContext } from "react";
// Create the Auth Context
const SearchContext = createContext();

// searchProvider component to provide auth state
const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword:"",
    result:[],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the auth context
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
