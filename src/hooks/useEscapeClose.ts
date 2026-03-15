import { useEffect } from "react";

/**
 * Вызывает onClose при нажатии Escape, когда isOpen === true.
 */
export function useEscapeClose(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);
}
