import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const DashboardIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const UsersIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const BriefcaseIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const BuildingIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>;
const AlertIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SettingsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

export const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) => {
    const location = useLocation();
    const { currentUser } = useAuth();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/admin/dashboard', icon: DashboardIcon, label: 'Главная' },
        { path: '/admin/users', icon: UsersIcon, label: 'Пользователи' },
        { path: '/admin/internships', icon: BriefcaseIcon, label: 'Стажировки' },
        { path: '/admin/companies', icon: BuildingIcon, label: 'Компании' },
        { path: '/admin/reports', icon: AlertIcon, label: 'Жалобы' },
        { path: '/admin/settings', icon: SettingsIcon, label: 'Настройки' },
    ];

    if (!currentUser) return null;

    return (
        <>
            {isOpen && <div className="admin-sidebar__overlay" onClick={onClose} />}

            <aside className={`admin-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isOpen ? 'is-open' : ''}`}>
                <div className="admin-sidebar__header">
                    <div className="admin-sidebar__avatar">
                        A
                    </div>
                    
                    {!isCollapsed && (
                        <div className="admin-sidebar__org-info">
                            <span className="admin-sidebar__org-name">
                                Панель управления
                            </span>
                            <span className="admin-sidebar__org-role">
                                Администратор платформы
                            </span>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <button className="sidebar-toggle" onClick={onToggleCollapse} aria-label="Свернуть меню" style={{ position: 'absolute', top: '24px', right: '12px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                )}

                {isCollapsed && (
                    <button className="sidebar-toggle sidebar-toggle--collapsed" onClick={onToggleCollapse} aria-label="Развернуть меню">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                )}

                <div style={{ height: '1px', background: 'var(--Primitives--neutral--200)', margin: '8px 0' }} />

                <nav className="admin-nav" onClick={() => { if (window.innerWidth <= 900) onClose(); }}>
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`admin-nav__link ${isActive(item.path) ? 'is-active' : ''}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <span className="admin-nav__icon">{item.icon}</span>
                            {!isCollapsed && <span className="admin-nav__label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};
