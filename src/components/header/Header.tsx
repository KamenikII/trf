import './Header.css';
import { useState, useEffect, useRef, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { useModals } from '../../context/ModalContext';
import { IUser } from '../../types';

/* ── SVG-Иконки ── */

function CoinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <text x="7" y="10.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="inherit">C</text>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1l1.39 2.81L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.11-.46L6 1z" />
    </svg>
  );
}

/* ── Пункты меню профиля ── */

interface IProfileMenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
}

const PROFILE_MENU_ITEMS: IProfileMenuItem[] = [
  {
    key: "profile",
    label: "Профиль",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 13.5c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    href: "/profile",
  },
  {
    key: "subscription",
    label: "Подписка",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 10.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "balance",
    label: "Баланс",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 4.5v1M8 10.5v1M6 7.5h2.5a1 1 0 0 1 0 2H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M10 5.5H7a1 1 0 0 0 0 2h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "favorites",
    label: "Избранные",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 2.5h9a1 1 0 0 1 1 1v11l-5.5-3-5.5 3v-11a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    href: "/favorites",
  },
  {
    key: "settings",
    label: "Настройки",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ── Бейджи ── */

interface ICoinBadgeProps {
  amount: number;
}

function CoinBadge({ amount }: ICoinBadgeProps) {
  return (
    <div className="header-badge header-badge--coin" title={`${amount} монет`}>
      <span className="header-badge__icon"><CoinIcon /></span>
      <span className="header-badge__value">{amount.toLocaleString("ru")}</span>
    </div>
  );
}

interface IRatingBadgeProps {
  value: number;
}

function RatingBadge({ value }: IRatingBadgeProps) {
  return (
    <div className="header-badge header-badge--rating" title={`Рейтинг: ${value}`}>
      <span className="header-badge__icon"><StarIcon /></span>
      <span className="header-badge__value">{value}</span>
    </div>
  );
}

/* ── Дропдаун профиля (desktop) ── */

interface IProfileDropdownProps {
  currentUser: IUser;
  onLogout: () => void;
  onClose: () => void;
}

function ProfileDropdown({ currentUser, onLogout, onClose }: IProfileDropdownProps) {
  return (
    <div className="profile-dropdown" role="menu" aria-label="Меню профиля">
      {/* Шапка */}
      <div className="profile-dropdown__header">
        <div className="profile-dropdown__avatar">
          {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
        </div>
        <div className="profile-dropdown__info">
          <span className="profile-dropdown__name">
            {currentUser.firstName} {currentUser.lastName}
          </span>
          <span className="profile-dropdown__email">{currentUser.email}</span>
        </div>
      </div>

      <div className="profile-dropdown__divider" />

      {/* Пункты меню */}
      <nav className="profile-dropdown__nav">
        {PROFILE_MENU_ITEMS.map((item) =>
          item.href ? (
            <Link
              key={item.key}
              to={item.href}
              className="profile-dropdown__item"
              onClick={onClose}
              role="menuitem"
            >
              <span className="profile-dropdown__item-icon">{item.icon}</span>
              {item.label}
            </Link>
          ) : (
            <button
              key={item.key}
              className="profile-dropdown__item"
              onClick={onClose}
              role="menuitem"
            >
              <span className="profile-dropdown__item-icon">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="profile-dropdown__divider" />

      {/* Выйти */}
      <button
        className="profile-dropdown__item profile-dropdown__item--danger"
        onClick={() => { onClose(); onLogout(); }}
        role="menuitem"
      >
        <span className="profile-dropdown__item-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M10.5 11L14 8l-3.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        Выйти
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   Header — основной компонент
   ══════════════════════════════════════════ */

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const { openPostModal, openAuthModal } = useModals();
  const isStudent = currentUser?.role === "student";

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Мок-данные профиля студента
  const studentCoins = currentUser?.coins ?? 1240;
  const studentRating = currentUser?.rating ?? 4.8;

  // Закрытие дропдауна по клику снаружи
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [profileDropdownOpen]);

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

  // Открытие одного меню закрывает другое
  const toggleMenu = () => {
    if (!menuOpen) setProfileMenuOpen(false);
    setMenuOpen(v => !v);
  };
  const toggleProfileMenu = () => {
    if (!profileMenuOpen) setMenuOpen(false);
    setProfileMenuOpen(v => !v);
  };

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
                  onClick={(e) => { e.preventDefault(); openPostModal(); }}>
                  <span className="btn-text">Разместить стажировку</span>
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button className="btn btn--primary" id="btn-login"
                  onClick={(e) => { e.preventDefault(); openAuthModal(); }}>
                  Войти
                </button>
              </>
            ) : (
              <>
                {!isStudent && (
                  <button className="btn btn--ghost" id="btn-cta-header" title="Разместить стажировку" aria-label="Разместить стажировку"
                    onClick={(e) => { e.preventDefault(); openPostModal(); }}>
                    <span className="btn-text">Разместить стажировку</span>
                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                )}

                {/* Баджи монет и рейтинга — только для студентов */}
                {isStudent && (
                  <div className="header__student-badges">
                    <CoinBadge amount={studentCoins} />
                    <RatingBadge value={studentRating} />
                  </div>
                )}

                {/* Аватарка + дропдаун */}
                <div className="header__profile-wrap" ref={dropdownRef}>
                  <button
                    className={`header__avatar-btn${profileDropdownOpen ? " is-active" : ""}`}
                    onClick={() => setProfileDropdownOpen(v => !v)}
                    aria-label="Профиль"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    id="btn-profile"
                  >
                    {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                  </button>

                  {profileDropdownOpen && (
                    <ProfileDropdown
                      currentUser={currentUser}
                      onLogout={logout}
                      onClose={() => setProfileDropdownOpen(false)}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <button className={`burger${menuOpen ? " is-active" : ""}`} id="burger-menu"
            aria-label="Меню" aria-expanded={menuOpen}
            onClick={toggleMenu}>
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

      {/* Profile mobile menu */}
      <div className={`mobile-menu${profileMenuOpen ? " is-open" : ""}`} id="mobile-profile-menu" role="dialog" aria-modal="true">
        <div className="mobile-menu__overlay" onClick={closeProfileMenu} />
        <div className="mobile-menu__panel mobile-menu__panel--profile">
          {currentUser && (
            <>
              {/* Шапка профиля */}
              <div className="mobile-profile__header">
                <div className="mobile-profile__avatar">
                  {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                </div>
                <div className="mobile-profile__info">
                  <span className="mobile-profile__name">{currentUser.firstName} {currentUser.lastName}</span>
                  <span className="mobile-profile__email">{currentUser.email}</span>
                </div>
              </div>

              <div className="mobile-profile__divider" />

              {/* Пункты меню */}
              <nav className="mobile-menu__nav">
                {PROFILE_MENU_ITEMS.map((item) =>
                  item.href ? (
                    <Link
                      key={item.key}
                      to={item.href}
                      className="mobile-menu__link mobile-menu__link--icon"
                      onClick={closeProfileMenu}
                    >
                      <span className="mobile-menu__item-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.key}
                      className="mobile-menu__link mobile-menu__link--icon"
                      onClick={closeProfileMenu}
                    >
                      <span className="mobile-menu__item-icon">{item.icon}</span>
                      {item.label}
                    </button>
                  )
                )}
              </nav>

              <div className="mobile-profile__divider" />

              {/* Выйти */}
              <button
                className="mobile-menu__link mobile-menu__link--icon mobile-menu__link--danger"
                onClick={() => { closeProfileMenu(); logout(); }}
              >
                <span className="mobile-menu__item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M10.5 11L14 8l-3.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
                Выйти
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mobile-bottom-nav">
        <button className={`btn btn--ghost${menuOpen ? " is-active" : ""}`} onClick={toggleMenu}>
          Меню
        </button>
        <div className="mobile-bottom-nav__right">
          {/* Кнопка «+» для не-студентов */}
          {(!currentUser || !isStudent) && (
            <button className="btn btn--ghost mobile-bottom-nav__post" aria-label="Разместить стажировку" onClick={(e) => { e.preventDefault(); closeMenu(); openPostModal(); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          )}

          {/* Баджи студента в мобильной панели */}
          {currentUser && isStudent && (
            <div className="mobile-bottom-nav__badges">
              <CoinBadge amount={studentCoins} />
              <RatingBadge value={studentRating} />
            </div>
          )}

          {!currentUser ? (
            <button className="btn btn--primary" onClick={(e) => { e.preventDefault(); closeMenu(); openAuthModal(); }}>
              Войти
            </button>
          ) : (
            <button
              className={`header__avatar-btn${profileMenuOpen ? " is-active" : ""}`}
              onClick={toggleProfileMenu}
              title="Профиль"
              style={{ width: "40px", height: "40px", fontSize: "var(--Typography--Primitives--font-size--14)" }}
            >
              {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
