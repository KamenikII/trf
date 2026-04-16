import { useState, useMemo, useCallback } from 'react';
import './AdminInternshipsPage.css';

/* ── Types ── */
type ModerationStatus = 'pending' | 'approved' | 'rejected';

interface IMockInternship {
    id: string;
    company: string;
    companyInitial: string;
    title: string;
    salary: string;
    format: string;
    city: string;
    status: ModerationStatus;
    rejectReason?: string;
    createdAt: string;
}

/* ── Mock data ── */
const MOCK_INTERNSHIPS: IMockInternship[] = [
    { id: '1', company: 'Яндекс', companyInitial: 'Я', title: 'Frontend-разработчик (React)', salary: '80 000 ₽', format: 'Удалённо', city: 'Москва', status: 'pending', createdAt: '2026-04-15' },
    { id: '2', company: 'Тинькофф', companyInitial: 'Т', title: 'Java Backend Developer', salary: '90 000 ₽', format: 'Офис', city: 'Москва', status: 'pending', createdAt: '2026-04-14' },
    { id: '3', company: 'VK', companyInitial: 'V', title: 'iOS Developer (Swift)', salary: '70 000 ₽', format: 'Гибрид', city: 'Санкт-Петербург', status: 'pending', createdAt: '2026-04-14' },
    { id: '4', company: 'Сбер', companyInitial: 'С', title: 'Data Scientist', salary: '100 000 ₽', format: 'Офис', city: 'Москва', status: 'approved', createdAt: '2026-04-12' },
    { id: '5', company: 'Ozon', companyInitial: 'O', title: 'QA Engineer', salary: '60 000 ₽', format: 'Удалённо', city: 'Любой', status: 'approved', createdAt: '2026-04-11' },
    { id: '6', company: 'Wildberries', companyInitial: 'W', title: 'Go Developer', salary: '85 000 ₽', format: 'Офис', city: 'Москва', status: 'approved', createdAt: '2026-04-10' },
    { id: '7', company: 'МТС', companyInitial: 'М', title: 'DevOps Intern', salary: '65 000 ₽', format: 'Гибрид', city: 'Москва', status: 'rejected', rejectReason: 'Неполное описание обязанностей', createdAt: '2026-04-09' },
    { id: '8', company: 'X5 Group', companyInitial: 'X', title: 'Product Analyst', salary: '55 000 ₽', format: 'Офис', city: 'Москва', status: 'rejected', rejectReason: 'Спам', createdAt: '2026-04-08' },
    { id: '9', company: 'Kaspersky', companyInitial: 'K', title: 'Security Analyst Intern', salary: '75 000 ₽', format: 'Офис', city: 'Москва', status: 'pending', createdAt: '2026-04-15' },
    { id: '10', company: 'Авито', companyInitial: 'А', title: 'ML Engineer Intern', salary: '95 000 ₽', format: 'Удалённо', city: 'Любой', status: 'pending', createdAt: '2026-04-16' },
];

const ROWS_PER_PAGE = 8;

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

/* ── Helpers ── */
const getStatusLabel = (status: ModerationStatus): string => {
    switch (status) {
        case 'pending': return 'На модерации';
        case 'approved': return 'Одобрена';
        case 'rejected': return 'Отклонена';
    }
};

/* ══════════════════════════════════════════
   AdminInternshipsPage
   ══════════════════════════════════════════ */

export const AdminInternshipsPage = () => {
    const [internships, setInternships] = useState<IMockInternship[]>(MOCK_INTERNSHIPS);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | ModerationStatus>('all');
    const [page, setPage] = useState(1);

    // Reject modal state
    const [rejectTarget, setRejectTarget] = useState<IMockInternship | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Counts per status
    const counts = useMemo(() => ({
        all: internships.length,
        pending: internships.filter(i => i.status === 'pending').length,
        approved: internships.filter(i => i.status === 'approved').length,
        rejected: internships.filter(i => i.status === 'rejected').length,
    }), [internships]);

    // Filtered
    const filteredInternships = useMemo(() => {
        let result = internships;

        if (activeTab !== 'all') {
            result = result.filter(i => i.status === activeTab);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.company.toLowerCase().includes(q) ||
                i.city.toLowerCase().includes(q)
            );
        }

        return result;
    }, [internships, activeTab, search]);

    const totalPages = Math.max(1, Math.ceil(filteredInternships.length / ROWS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedInternships = filteredInternships.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleTabChange = useCallback((tab: 'all' | ModerationStatus) => {
        setActiveTab(tab);
        setPage(1);
    }, []);

    // Actions
    const handleApprove = (id: string) => {
        setInternships(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' as ModerationStatus } : i));
    };

    const openRejectModal = (internship: IMockInternship) => {
        setRejectTarget(internship);
        setRejectReason('');
    };

    const submitReject = () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        setInternships(prev => prev.map(i =>
            i.id === rejectTarget.id
                ? { ...i, status: 'rejected' as ModerationStatus, rejectReason: rejectReason.trim() }
                : i
        ));
        setRejectTarget(null);
        setRejectReason('');
    };

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    }, [totalPages]);

    const tabs: { key: 'all' | ModerationStatus; label: string }[] = [
        { key: 'all', label: 'Все' },
        { key: 'pending', label: 'На модерации' },
        { key: 'approved', label: 'Одобренные' },
        { key: 'rejected', label: 'Отклонённые' },
    ];

    return (
        <div className="admin-internships">
            <div className="admin-internships__header">
                <h1 className="admin-internships__title">Модерация стажировок</h1>
            </div>

            {/* Toolbar */}
            <div className="admin-internships__toolbar">
                <div className="admin-status-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`admin-status-tab ${activeTab === tab.key ? 'is-active' : ''}`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            {tab.label}
                            <span className="admin-status-tab__count">{counts[tab.key]}</span>
                        </button>
                    ))}
                </div>

                <div className="admin-users__search" style={{ marginLeft: 'auto' }}>
                    <span className="admin-users__search-icon"><SearchIcon /></span>
                    <input
                        className="admin-users__search-input"
                        type="text"
                        placeholder="Поиск по позиции, компании..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Компания</th>
                            <th>Позиция</th>
                            <th>Зарплата</th>
                            <th>Формат</th>
                            <th>Город</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedInternships.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="admin-empty">Стажировки не найдены</div>
                                </td>
                            </tr>
                        ) : (
                            pagedInternships.map(internship => (
                                <tr key={internship.id}>
                                    <td>
                                        <div className="admin-company-cell">
                                            <div className="admin-company-cell__logo">
                                                {internship.companyInitial}
                                            </div>
                                            <span className="admin-company-cell__name">{internship.company}</span>
                                        </div>
                                    </td>
                                    <td>{internship.title}</td>
                                    <td><span className="admin-salary">{internship.salary}</span></td>
                                    <td><span className="admin-format">{internship.format}</span></td>
                                    <td><span className="admin-format">{internship.city}</span></td>
                                    <td>
                                        <span className={`admin-badge admin-badge--${internship.status}`} title={internship.rejectReason || undefined}>
                                            {getStatusLabel(internship.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-mod-actions">
                                            <button className="admin-mod-btn admin-mod-btn--view" title="Просмотр" aria-label="Просмотр">
                                                <EyeIcon />
                                            </button>
                                            {internship.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="admin-mod-btn admin-mod-btn--approve"
                                                        title="Одобрить"
                                                        aria-label="Одобрить"
                                                        onClick={() => handleApprove(internship.id)}
                                                    >
                                                        <CheckIcon />
                                                    </button>
                                                    <button
                                                        className="admin-mod-btn admin-mod-btn--reject"
                                                        title="Отклонить"
                                                        aria-label="Отклонить"
                                                        onClick={() => openRejectModal(internship)}
                                                    >
                                                        <XIcon />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {filteredInternships.length > ROWS_PER_PAGE && (
                    <div className="admin-pagination">
                        <span className="admin-pagination__info">
                            Показано {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredInternships.length)} из {filteredInternships.length}
                        </span>
                        <div className="admin-pagination__controls">
                            <button className="admin-pagination__btn" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)} aria-label="Предыдущая страница">
                                <ChevronLeftIcon />
                            </button>
                            {pageNumbers.map(n => (
                                <button key={n} className={`admin-pagination__btn ${n === currentPage ? 'is-active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                            ))}
                            <button className="admin-pagination__btn" disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Следующая страница">
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectTarget && (
                <div className="admin-reject-overlay" onClick={() => setRejectTarget(null)}>
                    <div className="admin-reject-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Отклонить стажировку</h3>
                        <p style={{ fontSize: '14px', color: 'var(--Primitives--neutral--600)', marginBottom: '16px' }}>
                            <strong>{rejectTarget.title}</strong> от <strong>{rejectTarget.company}</strong>
                        </p>
                        <textarea
                            className="admin-reject-textarea"
                            placeholder="Укажите причину отклонения..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            autoFocus
                        />
                        <div className="admin-reject-actions">
                            <button className="admin-confirm-btn admin-confirm-btn--cancel" onClick={() => setRejectTarget(null)}>Отмена</button>
                            <button
                                className="admin-confirm-btn admin-confirm-btn--danger"
                                onClick={submitReject}
                                disabled={!rejectReason.trim()}
                                style={{ opacity: rejectReason.trim() ? 1 : 0.5 }}
                            >
                                Отклонить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
