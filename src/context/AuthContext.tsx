import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AuthContextType {
    currentUser: IUser | null;
    login: (user: IUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>(null);

    const login = useCallback((user: IUser) => setCurrentUser(user), []);
    const logout = useCallback(() => setCurrentUser(null), []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
