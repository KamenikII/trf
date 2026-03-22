import './Header.css';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { useModals } from '../../context/ModalContext';


export const Header = () => {
  const { currentUser, logout } = useAuth();
  const { openPostModal, openAuthModal } = useModals();
  const isStudent = currentUser?.role === "student";

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (menuOpen || profileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen, profileMenuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const closeProfileMenu = () => setProfileMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="header" id="main-header">
        <div className="header__inner">
          <Link to="/" className="logo" id="logo">
            <img src="/img/Logo.svg" alt="стажёр.рф" className="logo__img" />
          </Link>
          <nav className="nav" id="main-nav">
            <a href="#" className="nav__link">Проекты</a>
            <a href="#" className="nav__link">Задания</a>
            <Link to="/" className={`nav__link${isActive("/") ? " nav__link--active" : ""}`}>Стажировки</Link>

            <a href="#" className="nav__link nav__tablet-hide">Магазин</a>

            <div className="nav__dropdown nav__tablet-hide">
              <button className="nav__link nav__link--dropdown" id="nav-resources">
                Ресурсы
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="nav__dropdown nav__tablet-show" style={{ position: 'relative' }} onMouseLeave={() => setMoreOpen(false)}>
              <button className="nav__link nav__link--dropdown" onClick={() => setMoreOpen(!moreOpen)}>
                Больше
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {moreOpen && (
                <div className="nav__dropdown-menu">
                  <a href="#" className="nav__dropdown-item">Магазин</a>
                  <a href="#" className="nav__dropdown-item">Ресурсы</a>
                </div>
              )}
            </div>
          </nav>
          <div className="header__actions">
            {!currentUser ? (
              <>
                <button className="btn btn--ghost" id="btn-cta-header" title="Разместить стажировку" aria-label="Разместить стажировку"
                  onClick={(e) => { e.preventDefault(); openPostModal(); }}
                  style={{ height: "36px", minHeight: "36px", padding: "0 16px" }}>
                  <span className="btn-text">Разместить стажировку</span>
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button className="btn btn--primary" id="btn-login"
                  onClick={(e) => { e.preventDefault(); openAuthModal(); }}
                  style={{ height: "36px", minHeight: "36px", padding: "0 16px" }}>
                  Войти
                </button>
              </>
            ) : (
              <>
                {!isStudent && (
                  <button className="btn btn--ghost" id="btn-cta-header" title="Разместить стажировку" aria-label="Разместить стажировку"
                    onClick={(e) => { e.preventDefault(); openPostModal(); }}
                    style={{ height: "36px", minHeight: "36px", padding: "0 16px" }}>
                    <span className="btn-text">Разместить стажировку</span>
                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                )}
                <button className="header__user" onClick={logout} title="Выйти"
                  style={{
                    cursor: "pointer", width: "36px", height: "36px",
                    borderRadius: "var(--Radius--Semantics--radius-avatar)",
                    background: "var(--Primitives--neutral--200)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "600", fontSize: "var(--Typography--Primitives--font-size--14)",
                    color: "var(--Primitives--neutral--700)",
                    border: "none", padding: 0, overflow: "hidden"
                  }}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Аватар" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                  ) : (
                    <>{currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}</>
                  )}
                </button>
              </>
            )}
          </div>
          <button className={`burger${menuOpen ? " is-active" : ""}`} id="burger-menu"
            aria-label="Меню" aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-menu" role="dialog" aria-modal="true">
        <div className="mobile-menu__overlay" onClick={closeMenu} />
        <div className="mobile-menu__panel">
          <nav className="mobile-menu__nav">
            <a href="#" className="mobile-menu__link" onClick={closeMenu}>Проекты</a>
            <a href="#" className="mobile-menu__link" onClick={closeMenu}>Задания</a>
            <Link to="/" className={`mobile-menu__link${isActive("/") ? " mobile-menu__link--active" : ""}`} onClick={closeMenu}>Стажировки</Link>
            <a href="#" className="mobile-menu__link" onClick={closeMenu}>Магазин</a>
            <a href="#" className="mobile-menu__link" onClick={closeMenu}>Ресурсы</a>
          </nav>
        </div>
      </div>

      {/* Profile mobile menu (for tablets/mobile) */}
      <div className={`mobile-menu nav__tablet-show ${profileMenuOpen ? " is-open" : ""}`} id="mobile-profile-menu" role="dialog" aria-modal="true" style={{ display: 'none' }}>
        <div className="mobile-menu__overlay" onClick={closeProfileMenu} />
        <div className="mobile-menu__panel">
          <nav className="mobile-menu__nav">
            {currentUser && (
              <>
                <div style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--Primitives--neutral--500)' }}>
                  {currentUser.email}
                </div>
                <hr style={{ border: 'none', borderBottom: '1px solid var(--Primitives--neutral--200)', margin: '8px 0' }} />
                <button
                  className="mobile-menu__link"
                  style={{ textAlign: 'left', background: 'none', border: 'none', color: "var(--Primitives--red--500)", cursor: "pointer", width: "100%", fontFamily: "inherit" }}
                  onClick={(e) => { e.preventDefault(); closeProfileMenu(); logout(); }}>
                  Выйти
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="mobile-bottom-nav">
        <button className={`btn btn--ghost${menuOpen ? " is-active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          Меню
        </button>
        <div className="mobile-bottom-nav__right">
          {(!currentUser || !isStudent) && (
            <button className="btn btn--ghost mobile-bottom-nav__post" aria-label="Разместить стажировку" onClick={(e) => { e.preventDefault(); closeMenu(); openPostModal(); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          )}
          {!currentUser ? (
            <button className="btn btn--primary" onClick={(e) => { e.preventDefault(); closeMenu(); openAuthModal(); }}>
              Войти
            </button>
          ) : (
            <button className={`header__user${profileMenuOpen ? " is-active" : ""}`} onClick={() => setProfileMenuOpen(!profileMenuOpen)} title="Профиль"
              style={{
                cursor: "pointer", width: "40px", height: "40px",
                borderRadius: "var(--Radius--Semantics--radius-avatar)",
                background: "var(--Primitives--neutral--200)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "600", fontSize: "var(--Typography--Primitives--font-size--14)",
                color: "var(--Primitives--neutral--700)",
                border: "none", overflow: "hidden",
                padding: 0
              }}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Аватар" style={{width: "100%", height: "100%", objectFit: "cover"}} />
              ) : (
                <>{currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}</>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
