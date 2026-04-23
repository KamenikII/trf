import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useModals } from "../../../../context/ModalContext";
import { PostModal } from "../../../post-modal/PostModal";
import { getCategoryClass } from "../../../../utils/helpers";
import "./InternshipsPage.css";

interface InternshipRecord {
    id: string;
    position: string;
    createdAt: string;
    deadline: string;
    status: 'active' | 'archived';
    views: number;
    applications: number;
    author: string;
    directions: { category: string; subcategory?: string }[];
    salary: string;
    format: string;
    city: string;
}

const MOCK_INTERNSHIPS: InternshipRecord[] = [
    {
        id: "1",
        position: "Стажёр-аналитик данных",
        createdAt: "20.03.2024",
        deadline: "15.04.2024",
        status: 'active',
        views: 1240,
        applications: 42,
        author: "Александр В.",
        directions: [{ category: "Аналитика" }],
        salary: "60 000 ₽",
        format: "Удалённо",
        city: "Москва"
    },
    {
        id: "2",
        position: "Бэкенд разработчик (Python)",
        createdAt: "18.03.2024",
        deadline: "10.04.2024",
        status: 'active',
        views: 890,
        applications: 15,
        author: "Мария К.",
        directions: [{ category: "IT", subcategory: "Python" }],
        salary: "80 000 ₽",
        format: "Гибрид",
        city: "Санкт-Петербург"
    },
    {
        id: "3",
        position: "SMM-менеджер",
        createdAt: "05.02.2024",
        deadline: "01.03.2024",
        status: 'archived',
        views: 2450,
        applications: 68,
        author: "Александр В.",
        directions: [{ category: "Маркетинг", subcategory: "SMM" }],
        salary: "45 000 ₽",
        format: "Офис",
        city: "Москва"
    }
];

const COLUMNS = [
    { id: 'author', label: 'Кто создал' },
    { id: 'createdAt', label: 'Дата создания' },
    { id: 'directions', label: 'Направления' },
    { id: 'salary', label: 'ЗП' },
    { id: 'format', label: 'Формат' },
    { id: 'city', label: 'Город' },
    { id: 'deadline', label: 'Дедлайн' },
    { id: 'views', label: 'Просмотры' },
    { id: 'applications', label: 'Заявки' },
];

export const InternshipsPage = () => {
    const { currentUser } = useAuth();
    const { showToast, openConfirm, closeConfirm } = useModals();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
    const [internships, setInternships] = useState<InternshipRecord[]>(MOCK_INTERNSHIPS);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(COLUMNS.map(c => c.id));
    const [showColSettings, setShowColSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowColSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const stats = {
        totalViews: internships.reduce((acc, curr) => acc + curr.views, 0),
        totalApps: internships.reduce((acc, curr) => acc + curr.applications, 0),
        activeCount: internships.filter(i => i.status === 'active').length
    };

    const handleArchive = (id: string) => {
        openConfirm({
            title: "Архивировать стажировку?",
            message: "Стажировка перестанет быть видимой для студентов, но останется в вашем архиве со всей статистикой.",
            confirmLabel: "Архивировать",
            onConfirm: () => {
                setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' } : i));
                closeConfirm();
                showToast("Стажировка перенесена в архив");
            }
        });
    };

    const handleDelete = (id: string) => {
        openConfirm({
            title: "Удалить стажировку?",
            message: "Это действие необратимо. Вся статистика и отклики будут удалены.",
            confirmLabel: "Удалить",
            variant: 'danger',
            onConfirm: () => {
                setInternships(prev => prev.filter(i => i.id !== id));
                closeConfirm();
                showToast("Стажировка удалена");
            }
        });
    };

    const toggleColumn = (id: string) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const displayedInternships = internships.filter(i => 
        activeTab === 'active' ? i.status === 'active' : i.status === 'archived'
    );

    const isVisible = (id: string) => visibleColumns.includes(id);

    return (
        <div className="internships-page">
            <header className="employees-header">
                <div className="title-row">
                    <h2 className="employees-header__title">Управление стажировками</h2>
                    <button className="btn btn--primary" onClick={() => setIsCreateModalOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Разместить стажировку
                    </button>
                </div>
                <p className="employees-header__desc">Отслеживайте активность соискателей и управляйте формами найма {currentUser?.companyName}</p>
            </header>

            {/* Always Visible Stats */}
            <div className="internship-stats-grid">
                <div className="stat-card">
                    <span className="stat-card__label">Активные позиции</span>
                    <span className="stat-card__value">{stats.activeCount}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__label">Общие просмотры</span>
                    <span className="stat-card__value">{stats.totalViews.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__label">Получено заявок</span>
                    <span className="stat-card__value">{stats.totalApps.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__label">Конверсия (Avg)</span>
                    <span className="stat-card__value">{((stats.totalApps / (stats.totalViews || 1)) * 100).toFixed(1)}%</span>
                </div>
            </div>

            {/* Table Section */}
            <div className="internships-table-container">
                <div className="internships-table-header">
                    <div className="tabs-minimal">
                        <button className={`tab-min ${activeTab === 'active' ? 'is-active' : ''}`} onClick={() => setActiveTab('active')}>Активные</button>
                        <button className={`tab-min ${activeTab === 'archive' ? 'is-active' : ''}`} onClick={() => setActiveTab('archive')}>Архив</button>
                    </div>
                    <div className="table-settings-wrap" ref={settingsRef}>
                        <button className="icon-btn" onClick={() => setShowColSettings(!showColSettings)} title="Настроить колонки">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                        {showColSettings && (
                            <div className="table-settings-dropdown">
                                <span className="settings-drop-title">Видимые колонки</span>
                                {COLUMNS.map(col => (
                                    <label key={col.id} className="settings-drop-item">
                                        <input type="checkbox" checked={visibleColumns.includes(col.id)} onChange={() => toggleColumn(col.id)} />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="stajer-table">
                        <thead>
                            <tr>
                                <th align="left">Стажировка</th>
                                {isVisible('author') && <th align="left">Автор</th>}
                                {isVisible('createdAt') && <th align="left">Создано</th>}
                                {isVisible('directions') && <th align="left">Направления</th>}
                                {isVisible('salary') && <th align="left">ЗП</th>}
                                {isVisible('format') && <th align="left">Формат</th>}
                                {isVisible('city') && <th align="left">Город</th>}
                                {isVisible('deadline') && <th align="left">Дедлайн</th>}
                                {isVisible('views') && <th align="center">Просмотры</th>}
                                {isVisible('applications') && <th align="center">Заявки</th>}
                                <th align="right">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedInternships.length > 0 ? (
                                displayedInternships.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="position-cell">
                                                <span className="position-name">{item.position}</span>
                                                <span className={`status-dot ${item.status === 'active' ? 'is-active' : ''}`}></span>
                                            </div>
                                        </td>
                                        {isVisible('author') && <td><span className="table-text">{item.author}</span></td>}
                                        {isVisible('createdAt') && <td><span className="table-date">{item.createdAt}</span></td>}
                                        {isVisible('directions') && (
                                            <td>
                                                <div className="card__tags">
                                                    {item.directions.map((d, i) => {
                                                        const cls = getCategoryClass(d.category);
                                                        return <span key={i} className={`tag tag--${cls || 'neutral'}`}>{d.subcategory || d.category}</span>;
                                                    })}
                                                </div>
                                            </td>
                                        )}
                                        {isVisible('salary') && <td><span className="table-text table-text--bold">{item.salary}</span></td>}
                                        {isVisible('format') && <td><span className="table-text">{item.format}</span></td>}
                                        {isVisible('city') && <td><span className="table-text">{item.city}</span></td>}
                                        {isVisible('deadline') && <td><span className="table-date">до {item.deadline}</span></td>}
                                        {isVisible('views') && <td align="center"><span className="table-count">{item.views}</span></td>}
                                        {isVisible('applications') && (
                                            <td align="center">
                                                <div className="table-apps-badge">{item.applications}</div>
                                            </td>
                                        )}
                                        <td align="right">
                                            <div className="table-actions">
                                                {item.status === 'active' ? (
                                                    <button className="icon-btn" onClick={() => handleArchive(item.id)} title="В архив">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                                                    </button>
                                                ) : (
                                                    <button className="icon-btn" onClick={() => setInternships(prev => prev.map(i => i.id === item.id ? {...i, status: 'active'} : i))} title="Восстановить">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><polyline points="16 8 21 8 21 3"></polyline><path d="M21 12a9 9 0 1 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><polyline points="8 16 3 16 3 21"></polyline></svg>
                                                    </button>
                                                )}
                                                <button className="icon-btn icon-btn--danger" onClick={() => handleDelete(item.id)} title="Удалить">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={visibleColumns.length + 2} align="center">
                                        <div className="empty-table-state">{activeTab === 'active' ? 'У вас пока нет активных стажировок' : 'Архив пуст'}</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PostModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSubmit={(data) => {
                    const newRecord: InternshipRecord = {
                        id: data.id,
                        position: data.position,
                        createdAt: new Date().toLocaleDateString('ru-RU'),
                        deadline: data.deadline || "Не указан",
                        status: 'active',
                        views: 0,
                        applications: 0,
                        author: `${currentUser?.firstName} ${currentUser?.lastName?.charAt(0)}.`,
                        directions: data.directions?.map((d: any) => ({ category: d.category, subcategory: d.sub })) || [{ category: "Прочее" }],
                        salary: data.salary ? `${Number(data.salary).toLocaleString("ru-RU")} ₽` : "Не указана",
                        format: data.format || "Удалённо",
                        city: data.city?.[0] || "Любой"
                    };
                    setInternships([newRecord, ...internships]);
                    showToast("Стажировка успешно опубликована!");
                }}
            />
        </div>
    );
};
