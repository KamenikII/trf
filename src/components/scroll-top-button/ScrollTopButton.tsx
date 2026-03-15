import './ScrollTopButton.css';
import { useState, useEffect } from "react";

export const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      className={`scroll-top-btn${visible ? " is-visible" : ""}`}
      id="scroll-top-btn"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
