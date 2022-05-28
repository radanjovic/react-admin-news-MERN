import { createContext, useState } from "react";

const AuthContext = createContext({});

// Context for entire app - since we are storing just basic user data and accessToken,
// which won't be too often changed, simple context is enough - no need for redux.
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;