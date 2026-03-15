import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            const focusable = container.querySelectorAll(focusableSelector);
            if (focusable.length === 0) return;

            const first = focusable[0] as HTMLElement;
            const last = focusable[focusable.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        // Focus first focusable element when trap activates
        const focusable = container.querySelectorAll(focusableSelector);
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 50);
        }

        container.addEventListener("keydown", handleKeyDown);
        return () => container.removeEventListener("keydown", handleKeyDown);
    }, [isActive]);

    return containerRef;
}
