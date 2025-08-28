import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({children}) 
{
    const [token, setToken] = useState();
    const [user , setUser]  = useState();

    const login = (newToken , newUser) => {
        setToken(newToken);
        setUser(newUser);
    }

    const logout = () => {
        setToken(null);
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ token , user , login , logout }}>
            {children}
        </AuthContext.Provider>
    )
} 


export function useAuth() {
    return useContext(AuthContext);
}