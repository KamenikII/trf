import { useState, useMemo, useCallback } from 'react';
import './AdminCompaniesPage.css';
import './AdminUsersPage.css'; // Reuse common table styles

interface IMockCompany {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    isEducational: boolean;
    isBlocked: boolean;
}

const MOCK_COMPANIES: IMockCompany[] = [
    { id: '1', name: 'Яндекс', email: 'hr@yandex.ru', isVerified: true, isEducational: false, isBlocked: false },
    { id: '2', name: 'Сбер', email: 'talent@sberbank.ru', isVerified: true, isEducational: false, isBlocked: false },
    { id: '3', name: 'ВШЭ', email: 'career@hse.ru', isVerified: true, isEducational: true, isBlocked: false },
    { id: '4', name: 'TechStartup LLC', email: 'hello@techstartup.io', isVerified: false, isEducational: false, isBlocked: false },
    { id: '5', name: 'CryptoScam', email: 'admin@cryptoscam.com', isVerified: false, isEducational: false, isBlocked: true },
    { id: '6', name: 'Skillfactory', email: 'hr@skillfactory.ru', isVerified: true, isEducational: true, isBlocked: false },
];

const ROWS_PER_PAGE = 8;

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
const BanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
);
const UnlockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
);
const ShieldCheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
    </svg>
);
const BookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);
const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

export const AdminCompaniesPage = () => {
    const [companies, setCompanies] = useState<IMockCompany[]>(MOCK_COMPANIES);
    const [search, setSearch] = useState('');
    const [verificationFilter, setVerificationFilter] = useState('all');
    const [eduFilter, setEduFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = companies;

        if (verificationFilter === 'verified') result = result.filter(c => c.isVerified);
        else if (verificationFilter === 'unverified') result = result.filter(c => !c.isVerified);

        if (eduFilter === 'edu') result = result.filter(c => c.isEducational);
        else if (eduFilter === 'commercial') result = result.filter(c => !c.isEducational);

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
        }

        return result;
    }, [companies, search, verificationFilter, eduFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    const toggleVerification = (id: string) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isVerified: !c.isVerified } : c));
    };

    const toggleEducational = (id: string) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isEducational: !c.isEducational } : c));
    };

    const toggleBlock = (id: string) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isBlocked: !c.isBlocked } : c));
    };

    const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    return (
        <div className="admin-companies">
            <div className="admin-companies__header">
                <h1 className="admin-companies__title">Управление компаниями</h1>
            </div>

            <div className="admin-companies__toolbar">
                <div className="admin-users__search" style={{ maxWidth: '300px' }}>
                    <span className="admin-users__search-icon"><SearchIcon /></span>
                    <input
                        className="admin-users__search-input"
                        type="text"
                        placeholder="Поиск компаний..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                <select className="admin-companies__filter-select" value={verificationFilter} onChange={(e) => { setVerificationFilter(e.target.value); setPage(1); }}>
                    <option value="all">Все (Верификация)</option>
                    <option value="verified">Верифицированные</option>
                    <option value="unverified">Неверифицированные</option>
                </select>

                <select className="admin-companies__filter-select" value={eduFilter} onChange={(e) => { setEduFilter(e.target.value); setPage(1); }}>
                    <option value="all">Все (Тип)</option>
                    <option value="edu">Образовательные (ВУЗы)</option>
                    <option value="commercial">Коммерческие</option>
                </select>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Email</th>
                            <th>Тип (Образ-ная)</th>
                            <th>Верификация</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={6}><div className="admin-empty">Компании не найдены</div></td></tr>
                        ) : paged.map(company => (
                            <tr key={company.id}>
                                <td>
                                    <div className="admin-user-cell">
                                        <div className="admin-user-cell__avatar" style={{ borderRadius: '6px' }}>
                                            {company.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="admin-user-cell__name">{company.name}</span>
                                    </div>
                                </td>
                                <td>{company.email}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="admin-toggle-switch" title={company.isEducational ? 'Снять статус ВУЗа' : 'Назначить статус ВУЗа'}>
                                            <input type="checkbox" checked={company.isEducational} onChange={() => toggleEducational(company.id)} />
                                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                                        </label>
                                        <span className={`admin-badge ${company.isEducational ? 'admin-badge--edu' : 'admin-badge--commercial'}`}>
                                            {company.isEducational ? <><BookIcon />&nbsp; ВУЗ/Курсы</> : 'Бизнес'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label className="admin-toggle-switch" title={company.isVerified ? 'Снять верификацию' : 'Верифицировать'}>
                                            <input type="checkbox" checked={company.isVerified} onChange={() => toggleVerification(company.id)} />
                                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                                        </label>
                                        <span className={`admin-badge ${company.isVerified ? 'admin-badge--verified' : 'admin-badge--unverified'}`}>
                                            {company.isVerified ? <><ShieldCheckIcon />&nbsp; Проверена</> : 'Новая'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`admin-badge ${company.isBlocked ? 'admin-badge--blocked' : 'admin-badge--active'}`}>
                                        {company.isBlocked ? 'Заблокирована' : 'Активна'}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="admin-action-btn" title="Просмотр профиля"><EyeIcon /></button>
                                        <button 
                                            className={`admin-action-btn ${company.isBlocked ? 'admin-action-btn--warn' : 'admin-action-btn--danger'}`}
                                            title={company.isBlocked ? "Разблокировать" : "Заблокировать"}
                                            onClick={() => toggleBlock(company.id)}
                                        >
                                            {company.isBlocked ? <UnlockIcon /> : <BanIcon />}
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
        </div>
    );
};
