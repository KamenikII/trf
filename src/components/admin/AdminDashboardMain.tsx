import './AdminDashboardMain.css';

// Моковые данные для дэшборда
const STATS = [
    { title: "Всего пользователей", value: "12,345", trend: "+12%", isUp: true },
    { title: "Активных компаний", value: "482", trend: "+5%", isUp: true },
    { title: "Текущих стажировок", value: "1,204", trend: "-2%", isUp: false },
    { title: "Новых откликов (за 24ч)", value: "356", trend: "+24%", isUp: true },
];

const RECENT_ACTIVITY = [
    { id: 1, text: "Компания «Яндекс» зарегистрировалась на платформе", time: "10 минут назад", type: "company" },
    { id: 2, text: "Новая стажировка: «Frontend-разработчик (React)»", time: "1 час назад", type: "internship" },
    { id: 3, text: "Пользователь Ivan Ivanov оставил жалобу", time: "3 часа назад", type: "report" },
    { id: 4, text: "Студент Anna Smith обновил(а) свое резюме", time: "5 часов назад", type: "user" },
];

const TrendingUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>
    </svg>
);

const TrendingDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline>
    </svg>
);

const UserPlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
);

const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);


const getActivityIcon = (type: string) => {
    switch (type) {
        case 'user':
        case 'company': return <UserPlusIcon />;
        case 'internship':
        case 'report': return <FileIcon />;
        default: return <FileIcon />;
    }
}

export const AdminDashboardMain = () => {
    return (
        <div className="admin-main">
            <h1 className="admin-section-title" style={{ fontSize: '24px', marginBottom: 0 }}>Обзор платформы</h1>
            
            <div className="admin-stats-grid">
                {STATS.map((stat, i) => (
                    <div key={i} className="admin-stat-card">
                        <span className="admin-stat-card__title">{stat.title}</span>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <span className="admin-stat-card__value">{stat.value}</span>
                            <span className={`admin-stat-card__trend ${stat.isUp ? 'admin-stat-card__trend--up' : 'admin-stat-card__trend--down'}`}>
                                {stat.isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <section className="admin-recent-section">
                <h2 className="admin-section-title">Последние события</h2>
                <div className="admin-activity-list">
                    {RECENT_ACTIVITY.map(activity => (
                        <div key={activity.id} className="admin-activity-item">
                            <div className="admin-activity-icon">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="admin-activity-content">
                                <span className="admin-activity-text">{activity.text}</span>
                                <span className="admin-activity-time">{activity.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
