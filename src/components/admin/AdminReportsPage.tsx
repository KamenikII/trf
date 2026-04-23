import { useState, useMemo } from 'react';
import './AdminReportsPage.css';
import './AdminUsersPage.css'; // Reuse table styles

/* ── Types ── */
type ReportStatus = 'new' | 'in-review' | 'resolved' | 'dismissed';
type ReportCategory = 'spam' | 'fraud' | 'outdated' | 'other';

interface IMockReport {
    id: string;
    fromUser: string;
    fromEmail: string;
    targetType: 'internship' | 'user' | 'company';
    targetName: string;
    category: ReportCategory;
    status: ReportStatus;
    description: string;
    createdAt: string;
}

/* ── Mock data ── */
const MOCK_REPORTS: IMockReport[] = [
    { id: '1', fromUser: 'Иван Иванов', fromEmail: 'student@test.com', targetType: 'internship', targetName: 'Маркетолог-стажёр (CryptoScam)', category: 'fraud', status: 'new', description: 'Компания запрашивает деньги за участие в стажировке. Похоже на мошенничество: просят оплатить «обучающий курс» перед началом работы.', createdAt: '2026-04-16' },
    { id: '2', fromUser: 'Анна Смирнова', fromEmail: 'anna@mail.ru', targetType: 'internship', targetName: 'PHP Developer (Freelance)', category: 'spam', status: 'new', description: 'Это не стажировка, а обычная вакансия фрилансера. Описание скопировано с другого сайта.', createdAt: '2026-04-15' },
    { id: '3', fromUser: 'Дмитрий Козлов', fromEmail: 'dmitry@ya.ru', targetType: 'internship', targetName: 'Аналитик данных (ООО Ромашка)', category: 'outdated', status: 'in-review', description: 'Стажировка закрылась ещё в марте, но карточка до сих пор висит. Пытался откликнуться — ответа нет.', createdAt: '2026-04-14' },
    { id: '4', fromUser: 'Мария Федорова', fromEmail: 'maria@gmail.com', targetType: 'user', targetName: 'Пользователь "spammer2026"', category: 'spam', status: 'resolved', description: 'Пользователь рассылает спам-сообщения всем студентам с предложением «заработка без вложений».', createdAt: '2026-04-12' },
    { id: '5', fromUser: 'Елена Волкова', fromEmail: 'hr@techcorp.ru', targetType: 'company', targetName: 'Компания "FakeAgency"', category: 'fraud', status: 'new', description: 'Компания использует наш логотип и название для привлечения стажёров. Это не наш партнёр.', createdAt: '2026-04-11' },
    { id: '6', fromUser: 'Алексей Новиков', fromEmail: 'alexey@bk.ru', targetType: 'internship', targetName: 'Менеджер по продажам (MLM Corp)', category: 'other', status: 'dismissed', description: 'Стажировка подразумевает сетевой маркетинг, а не реальную работу менеджером.', createdAt: '2026-04-10' },
    { id: '7', fromUser: 'Сергей Морозов', fromEmail: 'sergey@inbox.ru', targetType: 'internship', targetName: 'Backend Dev (StartupInc)', category: 'outdated', status: 'new', description: 'Дедлайн стажировки был 01.03.2026, но она до сих пор отображается в поиске.', createdAt: '2026-04-09' },
];

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);
const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

/* ── Helpers ── */
const getStatusLabel = (s: ReportStatus) => {
    switch (s) {
        case 'new': return 'Новая';
        case 'in-review': return 'На рассмотрении';
        case 'resolved': return 'Решена';
        case 'dismissed': return 'Отклонена';
    }
};

const getCategoryLabel = (c: ReportCategory) => {
    switch (c) {
        case 'spam': return 'Спам';
        case 'fraud': return 'Мошенничество';
        case 'outdated': return 'Неактуальная';
        case 'other': return 'Другое';
    }
};

const getTargetTypeLabel = (t: IMockReport['targetType']) => {
    switch (t) {
        case 'internship': return 'Стажировка';
        case 'user': return 'Пользователь';
        case 'company': return 'Компания';
    }
};

const ROWS_PER_PAGE = 8;

/* ══════════════════════════════════════════
   AdminReportsPage
   ══════════════════════════════════════════ */
export const AdminReportsPage = () => {
    const [reports, setReports] = useState<IMockReport[]>(MOCK_REPORTS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [detailReport, setDetailReport] = useState<IMockReport | null>(null);

    const filtered = useMemo(() => {
        let result = reports;
        if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
        if (categoryFilter !== 'all') result = result.filter(r => r.category === categoryFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                r.fromUser.toLowerCase().includes(q) ||
                r.targetName.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q)
            );
        }
        return result;
    }, [reports, search, statusFilter, categoryFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
    const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    const updateStatus = (id: string, status: ReportStatus) => {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        setDetailReport(null);
    };

    const newCount = reports.filter(r => r.status === 'new').length;

    return (
        <div className="admin-reports">
            <div className="admin-reports__header">
                <h1 className="admin-reports__title">
                    Жалобы и обращения
                    {newCount > 0 && <span className="admin-status-tab__count" style={{ marginLeft: '8px', fontSize: '13px', padding: '2px 8px', background: '#DC2626', color: '#fff' }}>{newCount}</span>}
                </h1>
            </div>

            <div className="admin-reports__toolbar">
                <div className="admin-users__search" style={{ maxWidth: '300px' }}>
                    <span className="admin-users__search-icon"><SearchIcon /></span>
                    <input className="admin-users__search-input" type="text" placeholder="Поиск по жалобе..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>

                <select className="admin-users__filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="in-review">На рассмотрении</option>
                    <option value="resolved">Решённые</option>
                    <option value="dismissed">Отклонённые</option>
                </select>

                <select className="admin-users__filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                    <option value="all">Все категории</option>
                    <option value="spam">Спам</option>
                    <option value="fraud">Мошенничество</option>
                    <option value="outdated">Неактуальная</option>
                    <option value="other">Другое</option>
                </select>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>От кого</th>
                            <th>На что</th>
                            <th>Категория</th>
                            <th>Описание</th>
                            <th>Статус</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={7}><div className="admin-empty">Жалобы не найдены</div></td></tr>
                        ) : paged.map(report => (
                            <tr key={report.id}>
                                <td>
                                    <div className="admin-user-cell">
                                        <div className="admin-user-cell__avatar">
                                            {report.fromUser.split(' ').map(w => w[0]).join('')}
                                        </div>
                                        <span className="admin-user-cell__name">{report.fromUser}</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{report.targetName}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--Primitives--neutral--500)' }}>{getTargetTypeLabel(report.targetType)}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`admin-badge admin-badge--${report.category}`}>
                                        {getCategoryLabel(report.category)}
                                    </span>
                                </td>
                                <td>
                                    <span className="admin-report-text" title={report.description}>{report.description}</span>
                                </td>
                                <td>
                                    <span className={`admin-badge admin-badge--${report.status}`}>
                                        {getStatusLabel(report.status)}
                                    </span>
                                </td>
                                <td style={{ whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--Primitives--neutral--500)' }}>
                                    {report.createdAt}
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="admin-action-btn" title="Подробнее" onClick={() => setDetailReport(report)}>
                                            <EyeIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length > ROWS_PER_PAGE && (
                    <div className="admin-pagination">
                        <span className="admin-pagination__info">Показано {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} из {filtered.length}</span>
                        <div className="admin-pagination__controls">
                            <button className="admin-pagination__btn" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeftIcon /></button>
                            {pageNumbers.map(n => <button key={n} className={`admin-pagination__btn ${n === currentPage ? 'is-active' : ''}`} onClick={() => setPage(n)}>{n}</button>)}
                            <button className="admin-pagination__btn" disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRightIcon /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailReport && (
                <div className="admin-report-detail-overlay" onClick={() => setDetailReport(null)}>
                    <div className="admin-report-detail" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-report-detail__header">
                            <h3 className="admin-report-detail__title">Жалоба #{detailReport.id}</h3>
                            <button className="admin-report-detail__close" onClick={() => setDetailReport(null)}><XIcon /></button>
                        </div>

                        <div className="admin-report-detail__field">
                            <div className="admin-report-detail__label">От кого</div>
                            <div className="admin-report-detail__value">{detailReport.fromUser} ({detailReport.fromEmail})</div>
                        </div>

                        <div className="admin-report-detail__field">
                            <div className="admin-report-detail__label">Объект жалобы</div>
                            <div className="admin-report-detail__value">
                                <span className={`admin-badge admin-badge--${detailReport.targetType === 'internship' ? 'company' : detailReport.targetType === 'user' ? 'student' : 'company'}`} style={{ marginRight: '8px' }}>
                                    {getTargetTypeLabel(detailReport.targetType)}
                                </span>
                                {detailReport.targetName}
                            </div>
                        </div>

                        <div className="admin-report-detail__field">
                            <div className="admin-report-detail__label">Категория</div>
                            <div className="admin-report-detail__value">
                                <span className={`admin-badge admin-badge--${detailReport.category}`}>{getCategoryLabel(detailReport.category)}</span>
                            </div>
                        </div>

                        <div className="admin-report-detail__field">
                            <div className="admin-report-detail__label">Описание</div>
                            <div className="admin-report-detail__value">{detailReport.description}</div>
                        </div>

                        <div className="admin-report-detail__divider" />

                        <div className="admin-report-detail__field">
                            <div className="admin-report-detail__label">Текущий статус</div>
                            <div className="admin-report-detail__value">
                                <span className={`admin-badge admin-badge--${detailReport.status}`}>{getStatusLabel(detailReport.status)}</span>
                            </div>
                        </div>

                        {(detailReport.status === 'new' || detailReport.status === 'in-review') && (
                            <div className="admin-report-detail__actions">
                                {detailReport.status === 'new' && (
                                    <button className="admin-report-btn admin-report-btn--secondary" onClick={() => updateStatus(detailReport.id, 'in-review')}>
                                        Взять в работу
                                    </button>
                                )}
                                <button className="admin-report-btn admin-report-btn--dismiss" onClick={() => updateStatus(detailReport.id, 'dismissed')}>
                                    Отклонить
                                </button>
                                <button className="admin-report-btn admin-report-btn--resolve" onClick={() => updateStatus(detailReport.id, 'resolved')}>
                                    Решена ✓
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
