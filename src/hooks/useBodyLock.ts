import { useEffect } from "react";

/**
 * Блокирует прокрутку body, когда isLocked === true.
 * Компенсирует ширину скроллбара, чтобы страница не прыгала.
 */
export function useBodyLock(isLocked: boolean): void {
    useEffect(() => {
        if (isLocked) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isLocked]);
}
