import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { IUser } from "../types";
import { updateUser } from "../data/users";

export interface AuthContextType {
    currentUser: IUser | null;
    login: (user: IUser) => void;
    logout: () => void;
    updateProfile: (updates: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    const login = useCallback((user: IUser) => setCurrentUser(user), []);
    const logout = useCallback(() => setCurrentUser(null), []);
    const updateProfile = useCallback((updates: Partial<IUser>) => {
        setCurrentUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            updateUser(prev.id, updates);
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
