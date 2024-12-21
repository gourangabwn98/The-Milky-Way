import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const UsersContext = createContext();

const UserProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      setAllUsers(data?.TotalUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={[allUsers, setAllUsers]}>
      {children}
    </UsersContext.Provider>
  );
};

// Custom hook
const useUser = () => useContext(UsersContext);

export { useUser, UserProvider };
