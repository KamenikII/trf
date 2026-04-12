import React, { useState, useEffect } from 'react';
import { CompanySidebar } from './CompanySidebar';
import './CompanyDashboard.css';
import { MenuIcon } from '../../ui/Icons';

export const CompanyDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === 'true') setIsCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            localStorage.setItem('sidebar-collapsed', (!prev).toString());
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
        <div className={`company-dashboard ${isCollapsed ? 'is-collapsed' : ''}`}>
            <CompanySidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />
            
            <main className="company-dashboard__main">
                {/* Mobile Topbar with Burger - only visible when sidebar is closed */}
                {!sidebarOpen && (
                    <div className="company-dashboard__topbar">
                        <button className="company-dashboard__burger" onClick={() => setSidebarOpen(true)} aria-label="Открыть меню">
                            <MenuIcon size={20} />
                        </button>
                    </div>
                )}

                <div className="company-dashboard__content">
                    {children}
                </div>
            </main>
        </div>
    );
};
