import './Hero.css';
import { useModals } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from "react";

export const Hero = () => {
  const { openPostModal } = useModals();
  const { currentUser } = useAuth();
  const isStudent = currentUser?.role === "student";
  const [heroHeight, setHeroHeight] = useState("auto");

  useEffect(() => {
    // Only capture fixed height once on initial mount for mobile to prevent address-bar jumps
    if (window.innerWidth <= 720) {
      setHeroHeight(`${window.innerHeight}px`);
    }
  }, []);

  const handleExplore = (e) => {
    e.preventDefault();
    const board = document.getElementById("board");
    if (board) {
      const offset = window.innerWidth <= 900 ? 48 : 80;
      const y = board.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero"
      id="hero-section"
      style={{ minHeight: heroHeight !== "auto" ? heroHeight : undefined }}
    >
      <div className="hero__container">
        <img src="/img/Logo.svg" alt="стажёр.рф" className="hero__logo" />
        <h1 className="hero__title">
          Доска стажировок<br />для студентов и выпускников
        </h1>
        <p className="hero__subtitle">
          Находи стажировки в лучших компаниях, фильтруй по направлению<br className="hide-mobile" />
          и городу — начни карьеру уже сегодня
        </p>
        <div className="hero__actions">
          <a href="#board" className="btn btn--primary btn--lg" id="btn-explore" onClick={handleExplore}>
            Найти стажировку
          </a>
          {!isStudent && (
            <button className="btn btn--outline btn--lg" id="btn-for-companies"
              onClick={(e) => { e.preventDefault(); openPostModal(); }}>
              Разместить стажировку
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
