import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import './AdminDashboard.css';

const MenuIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved === 'true') setIsCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            localStorage.setItem('admin-sidebar-collapsed', (!prev).toString());
            return !prev;
        });
    };

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('sidebar-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('sidebar-open');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('sidebar-open');
        }
    }, [sidebarOpen]);
    
    return (
        <div className={`admin-dashboard ${isCollapsed ? 'is-collapsed' : ''}`}>
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />
            
            <main className="admin-dashboard__main">
                {/* Mobile Topbar with Burger - only visible when sidebar is closed */}
                {!sidebarOpen && (
                    <div className="admin-dashboard__topbar">
                        <button className="admin-dashboard__burger" onClick={() => setSidebarOpen(true)} aria-label="Открыть меню">
                            <MenuIcon size={20} />
                        </button>
                    </div>
                )}

                <div className="admin-dashboard__content">
                    {children}
                </div>
            </main>
        </div>
    );
};
