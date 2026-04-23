import { useState, useEffect } from 'react';
import './AdminSettingsPage.css';
import './AdminCompaniesPage.css'; // Reuse toggle switch

/* ── Default settings ── */
interface IPlatformSettings {
    maxInternshipsPerCompany: number;
    pinPrice: number;
    requireModeration: boolean;
    allowRegistration: boolean;
    maintenanceMode: boolean;
    bannerText: string;
    bannerEnabled: boolean;
    contactEmail: string;
    defaultDeadlineDays: number;
}

const DEFAULT_SETTINGS: IPlatformSettings = {
    maxInternshipsPerCompany: 10,
    pinPrice: 500,
    requireModeration: true,
    allowRegistration: true,
    maintenanceMode: false,
    bannerText: '🎉 Добро пожаловать на стажёр.рф — крупнейшую платформу стажировок в России!',
    bannerEnabled: true,
    contactEmail: 'support@stajer.rf',
    defaultDeadlineDays: 30,
};

/* ══════════════════════════════════════════
   AdminSettingsPage
   ══════════════════════════════════════════ */
export const AdminSettingsPage = () => {
    const [settings, setSettings] = useState<IPlatformSettings>(() => {
        const saved = localStorage.getItem('admin_platform_settings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    const [isDirty, setIsDirty] = useState(false);
    const [toast, setToast] = useState('');

    const update = <K extends keyof IPlatformSettings>(key: K, value: IPlatformSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        localStorage.setItem('admin_platform_settings', JSON.stringify(settings));
        setIsDirty(false);
        setToast('Настройки сохранены');
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        setIsDirty(true);
    };

    // Auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <div className="admin-settings">
            <h1 className="admin-settings__title">Настройки платформы</h1>

            {/* ── Section: Лимиты ── */}
            <section className="admin-settings-section">
                <h2 className="admin-settings-section__title">Лимиты и тарифы</h2>
                <p className="admin-settings-section__desc">Глобальные параметры для компаний и стажировок</p>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Макс. стажировок на компанию</span>
                        <span className="admin-settings-row__hint">Сколько стажировок компания может опубликовать одновременно</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <input
                            className="admin-settings-number"
                            type="number"
                            min={1}
                            max={100}
                            value={settings.maxInternshipsPerCompany}
                            onChange={(e) => update('maxInternshipsPerCompany', Math.max(1, Number(e.target.value)))}
                        />
                    </div>
                </div>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Стоимость закрепления (₽)</span>
                        <span className="admin-settings-row__hint">Цена за закрепление стажировки в топе списка</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <input
                            className="admin-settings-number"
                            type="number"
                            min={0}
                            step={50}
                            value={settings.pinPrice}
                            onChange={(e) => update('pinPrice', Math.max(0, Number(e.target.value)))}
                        />
                    </div>
                </div>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Дедлайн по умолчанию (дней)</span>
                        <span className="admin-settings-row__hint">Через сколько дней стажировка автоматически деактивируется</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <input
                            className="admin-settings-number"
                            type="number"
                            min={7}
                            max={365}
                            value={settings.defaultDeadlineDays}
                            onChange={(e) => update('defaultDeadlineDays', Math.max(7, Number(e.target.value)))}
                        />
                    </div>
                </div>
            </section>

            {/* ── Section: Модерация ── */}
            <section className="admin-settings-section">
                <h2 className="admin-settings-section__title">Модерация и безопасность</h2>
                <p className="admin-settings-section__desc">Управление правилами публикации и доступа</p>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Обязательная модерация стажировок</span>
                        <span className="admin-settings-row__hint">Новые стажировки проходят проверку перед публикацией</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <label className="admin-toggle-switch">
                            <input type="checkbox" checked={settings.requireModeration} onChange={(e) => update('requireModeration', e.target.checked)} />
                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                        </label>
                    </div>
                </div>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Открытая регистрация</span>
                        <span className="admin-settings-row__hint">Пользователи могут регистрироваться самостоятельно</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <label className="admin-toggle-switch">
                            <input type="checkbox" checked={settings.allowRegistration} onChange={(e) => update('allowRegistration', e.target.checked)} />
                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                        </label>
                    </div>
                </div>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Режим обслуживания</span>
                        <span className="admin-settings-row__hint">Сайт недоступен для обычных пользователей (только для админа)</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <label className="admin-toggle-switch">
                            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => update('maintenanceMode', e.target.checked)} />
                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                        </label>
                    </div>
                </div>
            </section>

            {/* ── Section: Баннер ── */}
            <section className="admin-settings-section">
                <h2 className="admin-settings-section__title">Баннер / CTA</h2>
                <p className="admin-settings-section__desc">Текст, отображаемый на главной странице платформы</p>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Показывать баннер</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <label className="admin-toggle-switch">
                            <input type="checkbox" checked={settings.bannerEnabled} onChange={(e) => update('bannerEnabled', e.target.checked)} />
                            <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                        </label>
                    </div>
                </div>

                {settings.bannerEnabled && (
                    <div className="admin-settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div className="admin-settings-row__info" style={{ marginBottom: '8px' }}>
                            <span className="admin-settings-row__label">Текст баннера</span>
                        </div>
                        <textarea
                            className="admin-settings-textarea"
                            value={settings.bannerText}
                            onChange={(e) => update('bannerText', e.target.value)}
                            placeholder="Введите текст баннера..."
                        />
                    </div>
                )}
            </section>

            {/* ── Section: Контакты ── */}
            <section className="admin-settings-section">
                <h2 className="admin-settings-section__title">Контактная информация</h2>
                <p className="admin-settings-section__desc">Email для обратной связи, отображаемый пользователям</p>

                <div className="admin-settings-row">
                    <div className="admin-settings-row__info">
                        <span className="admin-settings-row__label">Email поддержки</span>
                    </div>
                    <div className="admin-settings-row__control">
                        <input
                            className="admin-settings-text"
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => update('contactEmail', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* ── Save Bar ── */}
            <div className="admin-settings-save-bar">
                <span className="admin-settings-save-bar__hint">
                    {isDirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены'}
                </span>
                <button className="admin-settings-btn admin-settings-btn--secondary" onClick={handleReset}>
                    Сбросить
                </button>
                <button className="admin-settings-btn admin-settings-btn--primary" onClick={handleSave} disabled={!isDirty}>
                    Сохранить
                </button>
            </div>

            {/* Toast */}
            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
};
