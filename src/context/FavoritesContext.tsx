import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface FavoritesContextType {
    favoriteIds: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "stajer_favorites";

function loadFavorites(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveFavorites(ids: string[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch { /* ignore */ }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

    useEffect(() => {
        saveFavorites(favoriteIds);
    }, [favoriteIds]);

    const toggleFavorite = useCallback((id: string) => {
        setFavoriteIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const isFavorite = useCallback((id: string) => {
        return favoriteIds.includes(id);
    }, [favoriteIds]);

    const clearFavorites = useCallback(() => {
        setFavoriteIds([]);
    }, []);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
    return ctx;
}
