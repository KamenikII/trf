import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useModals } from '../../../context/ModalContext';

interface CompanySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const DashboardIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const EmployeesIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const InternshipsIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const ProjectsIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const TasksIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const BillingIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const StudentsIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const SettingsIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LeaveIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const DeleteIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

export const CompanySidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: CompanySidebarProps) => {
    const { currentUser, logout, updateProfile } = useAuth();
    const location = useLocation();



    const links = [
        { path: "/profile/dashboard", label: "Дэшборд", icon: DashboardIcon, isDev: true },
        { path: "/profile/employees", label: "Сотрудники", icon: EmployeesIcon, isDev: true },
        ...(currentUser?.isEducational ? [{ path: "/profile/students", label: "Студенты", icon: StudentsIcon }] : []),
        { path: "/profile/internships", label: "Стажировки", icon: InternshipsIcon },
        { path: "/profile/projects", label: "Проекты", icon: ProjectsIcon, isDev: true },
        { path: "/profile/tasks", label: "Задания", icon: TasksIcon, isDev: true },
        { path: "/profile/billing", label: "Баланс и подписка", icon: BillingIcon },
        { path: "/profile/settings", label: "Настройки", icon: SettingsIcon },
    ];

    const isActive = (path: string) => location.pathname === path || (path === "/profile/dashboard" && location.pathname === "/profile");

    const renderDevBadge = (isMobile = false) => (
        <span style={{ 
            fontSize: '8px', 
            fontWeight: 800, 
            background: 'var(--Primitives--neutral--200)', 
            color: 'var(--Primitives--neutral--600)', 
            padding: '2px 8px', 
            borderRadius: '100px', 
            marginLeft: 'auto',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            lineHeight: 1
        }}>
            разработка
        </span>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`company-sidebar hide-mobile ${isCollapsed ? 'is-collapsed' : ''}`}>
                <div className="company-sidebar__header">
                    {isCollapsed ? (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <button className="sidebar-toggle" onClick={onToggleCollapse} aria-label="Развернуть">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="company-sidebar__avatar">
                                {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                    currentUser?.companyName?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="company-sidebar__org-info">
                                <span className="company-sidebar__org-name">{currentUser?.companyName}</span>
                                <span className="company-sidebar__org-role">Организация</span>
                            </div>
                            <button className="sidebar-toggle" onClick={onToggleCollapse} aria-label="Свернуть">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                <nav className="company-nav">
                    {links.map(link => (
                        <Link 
                            key={link.path} 
                            to={link.isDev ? "#" : link.path} 
                            className={`company-nav__link ${isActive(link.path) && !link.isDev ? 'is-active' : ''}`}
                            onClick={(e) => {
                                if (link.isDev) {
                                    e.preventDefault();
                                    return;
                                }
                                onClose();
                            }}
                            title={isCollapsed ? link.label : ""}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                opacity: link.isDev ? 0.5 : 1,
                                cursor: link.isDev ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span className="company-nav__icon">{link.icon}</span>
                            {!isCollapsed && (
                                <>
                                    <span className="company-nav__label">{link.label}</span>
                                    {link.isDev && renderDevBadge()}
                                </>
                            )}
                        </Link>
                    ))}
                    <div className="company-sidebar__divider" style={{ height: '1px', background: 'var(--Primitives--neutral--200)', margin: '8px 0' }}></div>
                </nav>

                {/* Sidebar Footer */}
                <div className="company-sidebar__footer" style={{ marginTop: 'auto', padding: '16px', fontSize: '11px', color: 'var(--Primitives--neutral--400)', lineHeight: 1.4, textAlign: isCollapsed ? 'center' : 'left' }}>
                    {!isCollapsed ? (
                        <>
                            <span>© 2026 стажёр.рф.<br/>Все права защищены.</span>
                            <div style={{ marginTop: '4px' }}>
                                <a href="/sitemap" style={{ color: 'var(--Primitives--neutral--500)', textDecoration: 'underline' }}>Карта сайта</a>
                            </div>
                        </>
                    ) : (
                        <a href="/sitemap" style={{ color: 'var(--Primitives--neutral--500)', textDecoration: 'underline' }} title="Карта сайта">К.С.</a>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar (Settings Style) */}
            <div className={`settings-mobile-menu ${isOpen ? 'is-open' : ''} show-mobile`}>
                <div className="settings-mobile-menu__header">
                    <button className="settings-mobile-menu__close" onClick={onClose} aria-label="Закрыть меню">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <nav className="settings-mobile-menu__nav">
                    {links.map(link => (
                        <Link 
                            key={link.path} 
                            to={link.isDev ? "#" : link.path} 
                            className={`settings-mobile-menu__item ${isActive(link.path) && !link.isDev ? 'is-active' : ''}`}
                            onClick={(e) => {
                                if (link.isDev) {
                                    e.preventDefault();
                                    return;
                                }
                                onClose();
                            }}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                opacity: link.isDev ? 0.5 : 1,
                                cursor: link.isDev ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span className="settings-nav__icon">{link.icon}</span>
                            {link.label}
                            {link.isDev && renderDevBadge(true)}
                        </Link>
                    ))}
                    <div className="settings-mobile-menu__divider"></div>
                    <button className="settings-mobile-menu__item settings-mobile-menu__item--danger" onClick={() => { if(logout) logout(); onClose(); }}>
                        <span className="settings-nav__icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </span>
                        Выйти из аккаунта
                    </button>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '16px', fontSize: '11px', color: 'var(--Primitives--neutral--400)', lineHeight: 1.4, textAlign: 'center' }}>
                        <span>© 2026 стажёр.рф. Все права защищены.</span>
                        <div style={{ marginTop: '8px' }}>
                            <a href="/sitemap" style={{ color: 'var(--Primitives--neutral--500)', textDecoration: 'underline' }}>Карта сайта</a>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};
