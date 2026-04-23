import { useState, useRef, useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useModals } from "../../../../context/ModalContext";
import "./CompanySettingsPage.css";

// Icons 
const CameraIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const SaveIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const LockIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const DeleteIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

export const CompanySettingsPage = () => {
    const { currentUser, updateProfile } = useAuth();
    const { showToast, openConfirm, closeConfirm } = useModals();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        companyName: currentUser?.companyName || "",
        contactEmail: currentUser?.contactEmail || currentUser?.email || "",
        useDefaultFormat: !!currentUser?.preferences?.defaultFormat,
        defaultFormat: currentUser?.preferences?.defaultFormat || "Удалённо",
        useDefaultEmployment: !!currentUser?.preferences?.defaultEmployment,
        defaultEmployment: currentUser?.preferences?.defaultEmployment || "Полная занятость",
        useDefaultExperience: !!currentUser?.preferences?.defaultExperience,
        defaultExperience: currentUser?.preferences?.defaultExperience || "Без опыта",
    });
    const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);

    const isDirty = (
        form.companyName !== (currentUser?.companyName || "") ||
        form.contactEmail !== (currentUser?.contactEmail || currentUser?.email || "") ||
        form.useDefaultFormat !== !!currentUser?.preferences?.defaultFormat ||
        (form.useDefaultFormat && form.defaultFormat !== (currentUser?.preferences?.defaultFormat || "Удалённо")) ||
        form.useDefaultEmployment !== !!currentUser?.preferences?.defaultEmployment ||
        (form.useDefaultEmployment && form.defaultEmployment !== (currentUser?.preferences?.defaultEmployment || "Полная занятость")) ||
        form.useDefaultExperience !== !!currentUser?.preferences?.defaultExperience ||
        (form.useDefaultExperience && form.defaultExperience !== (currentUser?.preferences?.defaultExperience || "Без опыта")) ||
        pendingAvatar !== null
    );

    const blocker = useBlocker(isDirty);

    useEffect(() => {
        if (blocker.state === "blocked") {
            openConfirm({
                title: "Несохраненные изменения",
                message: "Вы внесли изменения в настройки организации. Уверены, что хотите покинуть страницу? Все несохраненные данные будут потеряны.",
                confirmLabel: "Покинуть страницу",
                cancelLabel: "Остаться",
                variant: 'danger',
                onConfirm: () => blocker.proceed(),
                onCancel: () => blocker.reset()
            });
        }
    }, [blocker, openConfirm]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setPendingAvatar(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveInfo = () => {
        updateProfile({
            companyName: form.companyName,
            contactEmail: form.contactEmail,
            avatar: pendingAvatar || currentUser?.avatar,
            preferences: {
                ...currentUser?.preferences,
                defaultFormat: form.useDefaultFormat ? form.defaultFormat : null,
                defaultEmployment: form.useDefaultEmployment ? form.defaultEmployment : null,
                defaultExperience: form.useDefaultExperience ? form.defaultExperience : null,
            }
        });
        setPendingAvatar(null);
        showToast("Данные организации сохранены");
    };

    const handleDeleteOrg = () => {
        openConfirm({
            title: "Удаление организации",
            message: `Вы уверены, что хотите удалить организацию "${currentUser?.companyName}"? Это действие необратимо. (Обратите внимание: перед удалением все несохраненные изменения на этой странице будут потеряны)`,
            confirmLabel: "Удалить",
            variant: 'danger',
            onConfirm: () => {
                updateProfile({ companyName: undefined });
                closeConfirm();
            }
        });
    };

    return (
        <div className="company-settings">
            <header className="employees-header">
                <h2 className="employees-header__title">Настройки организации</h2>
                <p className="employees-header__desc">Управление профилем и предпочтениями {currentUser?.companyName}</p>
            </header>

            <div className="settings-grid">
                {/* Main Information */}
                <section className="settings-card">
                    <h3 className="settings-card__title">Основная информация</h3>
                    <div className="settings-card__content">
                        <div className="company-logo-section">
                            <div className="company-logo-preview" onClick={() => fileInputRef.current?.click()}>
                                {(pendingAvatar || currentUser?.avatar) ? (
                                    <img src={pendingAvatar || currentUser?.avatar || ""} alt="Logo" />
                                ) : (
                                    <div className="company-logo-placeholder">
                                        {currentUser?.companyName?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="company-logo-overlay">
                                    {CameraIcon}
                                </div>
                            </div>
                            <div className="company-logo-info">
                                <span className="logo-label">Логотип компании</span>
                                <span className="logo-hint">Квадратное изображение, до 5МБ</span>
                                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
                            </div>
                        </div>

                        <div className="settings-form-row">
                            <div className="settings-field">
                                <label className="settings-label">Название организации</label>
                                <input 
                                    type="text" 
                                    className="settings-input" 
                                    value={form.companyName} 
                                    onChange={e => setForm({...form, companyName: e.target.value})}
                                    placeholder="Введите название"
                                />
                            </div>
                            <div className="settings-field">
                                <label className="settings-label">Email для связи</label>
                                <input 
                                    type="email" 
                                    className="settings-input" 
                                    value={form.contactEmail} 
                                    onChange={e => setForm({...form, contactEmail: e.target.value})}
                                    placeholder="example@company.com"
                                />
                            </div>
                        </div>

                        <button className="btn btn--primary" onClick={handleSaveInfo} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                            {SaveIcon}
                            Сохранить данные
                        </button>
                    </div>
                </section>

                {/* Preferences */}
                <section className="settings-card">
                    <h3 className="settings-card__title">Предпочтения</h3>
                    <p className="settings-card__desc">Эти значения будут подставляться автоматически при создании новых объявлений</p>
                    <div className="settings-card__content">
                        {/* Format */}
                        <div className="preference-row">
                            <div className="preference-header">
                                <label className="settings-label">Формат работы по умолчанию</label>
                                <label className="st-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={form.useDefaultFormat} 
                                        onChange={e => setForm({...form, useDefaultFormat: e.target.checked})} 
                                    />
                                    <span className="st-switch__slider"></span>
                                </label>
                            </div>
                            <div className={`format-selector ${!form.useDefaultFormat ? 'is-disabled' : ''}`}>
                                {["Удалённо", "Офис", "Гибрид"].map(opt => (
                                    <button 
                                        key={opt}
                                        disabled={!form.useDefaultFormat}
                                        className={`format-option ${form.defaultFormat === opt ? 'is-active' : ''}`}
                                        onClick={() => setForm({...form, defaultFormat: opt})}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Employment */}
                        <div className="preference-row">
                            <div className="preference-header">
                                <label className="settings-label">Тип занятости по умолчанию</label>
                                <label className="st-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={form.useDefaultEmployment} 
                                        onChange={e => setForm({...form, useDefaultEmployment: e.target.checked})} 
                                    />
                                    <span className="st-switch__slider"></span>
                                </label>
                            </div>
                            <div className={`format-selector ${!form.useDefaultEmployment ? 'is-disabled' : ''}`}>
                                {["Полная занятость", "Частичная занятость"].map(opt => (
                                    <button 
                                        key={opt}
                                        disabled={!form.useDefaultEmployment}
                                        className={`format-option ${form.defaultEmployment === opt ? 'is-active' : ''}`}
                                        onClick={() => setForm({...form, defaultEmployment: opt})}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="preference-row">
                            <div className="preference-header">
                                <label className="settings-label">Требуемый опыт по умолчанию</label>
                                <label className="st-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={form.useDefaultExperience} 
                                        onChange={e => setForm({...form, useDefaultExperience: e.target.checked})} 
                                    />
                                    <span className="st-switch__slider"></span>
                                </label>
                            </div>
                            <div className={`format-selector ${!form.useDefaultExperience ? 'is-disabled' : ''}`}>
                                {["Без опыта", "До 1 года", "1-3 года"].map(opt => (
                                    <button 
                                        key={opt}
                                        disabled={!form.useDefaultExperience}
                                        className={`format-option ${form.defaultExperience === opt ? 'is-active' : ''}`}
                                        onClick={() => setForm({...form, defaultExperience: opt})}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn--primary" onClick={handleSaveInfo} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                            {SaveIcon}
                            Сохранить предпочтения
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="settings-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <h3 className="settings-card__title" style={{ color: 'var(--Semantics--error)' }}>Опасная зона</h3>
                    <p className="settings-card__desc">Необратимые действия с аккаунтом организации</p>
                    <div className="settings-card__content">
                        <button 
                            className="btn btn--danger" 
                            onClick={handleDeleteOrg} 
                            style={{ 
                                alignSelf: 'flex-start', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                color: 'var(--Semantics--error)', 
                                border: '1px solid rgba(239, 68, 68, 0.2)' 
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--Semantics--error)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.color = 'var(--Semantics--error)';
                            }}
                        >
                            {DeleteIcon}
                            Удалить организацию
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};
