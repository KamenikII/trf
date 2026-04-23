import { useState, useMemo, useCallback } from 'react';
import { IUser } from '../../types';
import './AdminUsersPage.css';

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

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

/* ── Mock data: расширяем пользователей для наглядного демо ── */
const MOCK_USERS: IUser[] = [
    { id: 1, email: "student@test.com", role: "student", firstName: "Иван", lastName: "Иванов", middleName: "Иванович" },
    { id: 2, email: "company@test.com", role: "company", firstName: "Петр", lastName: "Петров", companyName: "ООО Ромашка" },
    { id: 3, email: "admin@stajer.rf", role: "admin", firstName: "Админ", lastName: "Платформы" },
    { id: 4, email: "anna.smirnova@mail.ru", role: "student", firstName: "Анна", lastName: "Смирнова" },
    { id: 5, email: "dmitry.kozlov@yandex.ru", role: "student", firstName: "Дмитрий", lastName: "Козлов" },
    { id: 6, email: "hr@techcorp.ru", role: "company", firstName: "Елена", lastName: "Волкова", companyName: "TechCorp" },
    { id: 7, email: "maria.fed@gmail.com", role: "student", firstName: "Мария", lastName: "Федорова" },
    { id: 8, email: "alexey.novikov@mail.ru", role: "student", firstName: "Алексей", lastName: "Новиков" },
    { id: 9, email: "hr@digitalagency.ru", role: "company", firstName: "Ольга", lastName: "Кузнецова", companyName: "Digital Agency" },
    { id: 10, email: "sergey.morozov@bk.ru", role: "student", firstName: "Сергей", lastName: "Морозов" },
    { id: 11, email: "natalia.lebedeva@inbox.ru", role: "student", firstName: "Наталья", lastName: "Лебедева" },
    { id: 12, email: "hr@startupinc.io", role: "company", firstName: "Игорь", lastName: "Соколов", companyName: "StartupInc" },
    { id: 13, email: "ekaterina.popova@ya.ru", role: "student", firstName: "Екатерина", lastName: "Попова" },
    { id: 14, email: "pavel.orlov@gmail.com", role: "student", firstName: "Павел", lastName: "Орлов" },
    { id: 15, email: "hr@bigconsult.ru", role: "company", firstName: "Светлана", lastName: "Михайлова", companyName: "BigConsult" },
];

const ROWS_PER_PAGE = 8;

/* ── Helper: role label ── */
const getRoleLabel = (role: IUser['role']): string => {
    switch (role) {
        case 'student': return 'Студент';
        case 'company': return 'Компания';
        case 'admin': return 'Админ';
        default: return '—';
    }
};

/* ── Confirm Modal ── */
interface IConfirmModalProps {
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warn';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ title, message, confirmLabel, variant, onConfirm, onCancel }: IConfirmModalProps) => (
    <div className="admin-confirm-overlay" onClick={onCancel}>
        <div className="admin-confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="admin-confirm-actions">
                <button className="admin-confirm-btn admin-confirm-btn--cancel" onClick={onCancel}>Отмена</button>
                <button className={`admin-confirm-btn admin-confirm-btn--${variant}`} onClick={onConfirm}>{confirmLabel}</button>
            </div>
        </div>
    </div>
);

/* ══════════════════════════════════════════
   AdminUsersPage — основной компонент
   ══════════════════════════════════════════ */

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<IUser[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [blockedIds, setBlockedIds] = useState<Set<string | number>>(new Set());

    // Confirm modal state
    const [confirmAction, setConfirmAction] = useState<{
        type: 'block' | 'unblock' | 'delete';
        user: IUser;
    } | null>(null);

    // Filtered & searched users
    const filteredUsers = useMemo(() => {
        let result = users;

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(u =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.companyName && u.companyName.toLowerCase().includes(q))
            );
        }

        // Role filter
        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }

        // Status filter
        if (statusFilter === 'active') {
            result = result.filter(u => !blockedIds.has(u.id));
        } else if (statusFilter === 'blocked') {
            result = result.filter(u => blockedIds.has(u.id));
        }

        return result;
    }, [users, search, roleFilter, statusFilter, blockedIds]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedUsers = filteredUsers.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    // Reset page when filters change
    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleRoleFilter = useCallback((value: string) => {
        setRoleFilter(value);
        setPage(1);
    }, []);

    const handleStatusFilter = useCallback((value: string) => {
        setStatusFilter(value);
        setPage(1);
    }, []);

    // Actions
    const handleBlock = (user: IUser) => {
        setConfirmAction({ type: 'block', user });
    };

    const handleUnblock = (user: IUser) => {
        setConfirmAction({ type: 'unblock', user });
    };

    const handleDelete = (user: IUser) => {
        setConfirmAction({ type: 'delete', user });
    };

    const executeConfirm = () => {
        if (!confirmAction) return;
        const { type, user } = confirmAction;

        if (type === 'block') {
            setBlockedIds(prev => new Set(prev).add(user.id));
        } else if (type === 'unblock') {
            setBlockedIds(prev => {
                const next = new Set(prev);
                next.delete(user.id);
                return next;
            });
        } else if (type === 'delete') {
            setUsers(prev => prev.filter(u => u.id !== user.id));
        }

        setConfirmAction(null);
    };

    const getConfirmModalProps = (): IConfirmModalProps | null => {
        if (!confirmAction) return null;
        const { type, user } = confirmAction;
        const name = `${user.firstName} ${user.lastName}`;

        switch (type) {
            case 'block':
                return {
                    title: 'Заблокировать пользователя',
                    message: `Вы уверены, что хотите заблокировать пользователя «${name}» (${user.email})?`,
                    confirmLabel: 'Заблокировать',
                    variant: 'warn',
                    onConfirm: executeConfirm,
                    onCancel: () => setConfirmAction(null),
                };
            case 'unblock':
                return {
                    title: 'Разблокировать пользователя',
                    message: `Разблокировать пользователя «${name}» (${user.email})?`,
                    confirmLabel: 'Разблокировать',
                    variant: 'warn',
                    onConfirm: executeConfirm,
                    onCancel: () => setConfirmAction(null),
                };
            case 'delete':
                return {
                    title: 'Удалить пользователя',
                    message: `Это действие необратимо. Удалить пользователя «${name}» (${user.email})?`,
                    confirmLabel: 'Удалить',
                    variant: 'danger',
                    onConfirm: executeConfirm,
                    onCancel: () => setConfirmAction(null),
                };
            default: return null;
        }
    };

    const confirmProps = getConfirmModalProps();

    // Generate page numbers
    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }, [totalPages]);

    return (
        <div className="admin-users">
            <div className="admin-users__header">
                <h1 className="admin-users__title">Пользователи</h1>
            </div>

            {/* Toolbar */}
            <div className="admin-users__toolbar">
                <div className="admin-users__search">
                    <span className="admin-users__search-icon"><SearchIcon /></span>
                    <input
                        className="admin-users__search-input"
                        type="text"
                        placeholder="Поиск по имени или email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <select className="admin-users__filter-select" value={roleFilter} onChange={(e) => handleRoleFilter(e.target.value)}>
                    <option value="all">Все роли</option>
                    <option value="student">Студенты</option>
                    <option value="company">Компании</option>
                    <option value="admin">Админы</option>
                </select>

                <select className="admin-users__filter-select" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="blocked">Заблокированные</option>
                </select>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="admin-empty">Пользователи не найдены</div>
                                </td>
                            </tr>
                        ) : (
                            pagedUsers.map(user => {
                                const isBlocked = blockedIds.has(user.id);
                                const isAdmin = user.role === 'admin';

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-user-cell__avatar">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <span className="admin-user-cell__name">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${user.role}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${isBlocked ? 'admin-badge--blocked' : 'admin-badge--active'}`}>
                                                {isBlocked ? 'Заблокирован' : 'Активен'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="admin-action-btn" title="Просмотр" aria-label="Просмотр">
                                                    <EyeIcon />
                                                </button>
                                                {!isAdmin && (
                                                    <>
                                                        {isBlocked ? (
                                                            <button
                                                                className="admin-action-btn admin-action-btn--warn"
                                                                title="Разблокировать"
                                                                aria-label="Разблокировать"
                                                                onClick={() => handleUnblock(user)}
                                                            >
                                                                <UnlockIcon />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="admin-action-btn admin-action-btn--warn"
                                                                title="Заблокировать"
                                                                aria-label="Заблокировать"
                                                                onClick={() => handleBlock(user)}
                                                            >
                                                                <BanIcon />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="admin-action-btn admin-action-btn--danger"
                                                            title="Удалить"
                                                            aria-label="Удалить"
                                                            onClick={() => handleDelete(user)}
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {filteredUsers.length > ROWS_PER_PAGE && (
                    <div className="admin-pagination">
                        <span className="admin-pagination__info">
                            Показано {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredUsers.length)} из {filteredUsers.length}
                        </span>
                        <div className="admin-pagination__controls">
                            <button
                                className="admin-pagination__btn"
                                disabled={currentPage <= 1}
                                onClick={() => setPage(p => p - 1)}
                                aria-label="Предыдущая страница"
                            >
                                <ChevronLeftIcon />
                            </button>
                            {pageNumbers.map(n => (
                                <button
                                    key={n}
                                    className={`admin-pagination__btn ${n === currentPage ? 'is-active' : ''}`}
                                    onClick={() => setPage(n)}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                className="admin-pagination__btn"
                                disabled={currentPage >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                aria-label="Следующая страница"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            {confirmProps && <ConfirmModal {...confirmProps} />}
        </div>
    );
};
