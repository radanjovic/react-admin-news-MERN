import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// Custom hook to get fast access to auth context
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;