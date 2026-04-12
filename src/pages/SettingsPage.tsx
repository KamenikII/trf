import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useModals } from "../context/ModalContext";
import { useNavigate, useBlocker } from "react-router-dom";
import { useBodyLock } from "../hooks/useBodyLock";
import "../styles/settings.css";

// Icons 
import { ClearIcon, MenuIcon, CloseIcon } from "../components/ui/Icons";

export const SettingsPage = () => {
    const { currentUser, updateProfile, logout } = useAuth();
    const { showToast, openConfirm } = useModals();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useBodyLock(isMenuOpen);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    const isStudent = currentUser?.role === "student";
    const [activeTab, setActiveTab] = useState<"data" | "security">("data");

    const [form, setForm] = useState({
        lastName: currentUser?.lastName || "",
        firstName: currentUser?.firstName || "",
        middleName: currentUser?.middleName || "",
        university: currentUser?.university || "",
        direction: currentUser?.direction || "",
        course: currentUser?.course || 1
    });

    // Update form when currentUser changes (e.g. initial load)
    useEffect(() => {
        if (currentUser) {
            setForm({
                lastName: currentUser.lastName || "",
                firstName: currentUser.firstName || "",
                middleName: currentUser.middleName || "",
                university: currentUser.university || "",
                direction: currentUser.direction || "",
                course: currentUser.course || 1
            });
            setSkills(currentUser.skills || []);
        }
    }, [currentUser]);

    const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillOptions, setShowSkillOptions] = useState(false);
    const predefinedSkills = ["Data Analysis", "Финансовый аналитик", "JavaScript", "Python", "UX/UI", "Product Management"];
    
    // Mock user document
    const [proofFile, setProofFile] = useState<{name: string, url: string} | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const proofInputRef = useRef<HTMLInputElement>(null);
    const skillInputRef = useRef<HTMLInputElement>(null);

    const isDirty = (
        form.lastName !== (currentUser?.lastName || "") ||
        form.firstName !== (currentUser?.firstName || "") ||
        form.middleName !== (currentUser?.middleName || "") ||
        form.university !== (currentUser?.university || "") ||
        form.direction !== (currentUser?.direction || "") ||
        form.course !== (currentUser?.course || 1) ||
        JSON.stringify(skills) !== JSON.stringify(currentUser?.skills || []) ||
        proofFile !== null
    );

    const blocker = useBlocker(isDirty);

    useEffect(() => {
        if (blocker.state === "blocked") {
            openConfirm({
                title: "Несохраненные изменения",
                message: "Вы внесли изменения в настройки. Вы уверены, что хотите покинуть страницу? Все несохраненные данные будут потеряны.",
                confirmLabel: "Покинуть страницу",
                cancelLabel: "Остаться",
                variant: 'danger',
                onConfirm: () => blocker.proceed(),
                onCancel: () => blocker.reset()
            });
        }
    }, [blocker, openConfirm]);

    // Browser level prevent leave
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

    const handleSave = () => {
        updateProfile({
            firstName: form.firstName,
            lastName: form.lastName,
            middleName: form.middleName,
            university: form.university,
            direction: form.direction,
            course: form.course,
            skills
        });
        showToast("Изменения сохранены!"); 
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    updateProfile({ avatar: ev.target.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        setProofFile({name: file.name, url: ev.target.result as string});
                    }
                };
                reader.readAsDataURL(file);
            } else {
                setProofFile({name: file.name, url: ""});
            }
        }
    };

    const handleRemoveProof = () => {
        setProofFile(null);
        if(proofInputRef.current) proofInputRef.current.value = "";
    };

    const handleSkillAdd = (sk: string) => {
        if (!skills.includes(sk)) {
            setSkills([...skills, sk]);
        }
        setSkillInput("");
        setShowSkillOptions(false);
    };

    const handleSkillRemove = (sk: string) => {
        setSkills(skills.filter(s => s !== sk));
    };

    // Close skill input on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (skillInputRef.current && !skillInputRef.current.contains(e.target as Node)) {
                setShowSkillOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleMenuTabClick = (tab: "data" | "security") => {
        setActiveTab(tab);
        setIsMenuOpen(false);
    };

    if (!currentUser) return null;

    return (
        <div className="settings-page">
            <div className="settings-container">
                {/* Desktop Sidebar */}
                <aside className="settings-sidebar hide-mobile">
                    <nav className="settings-nav">
                        <button className={`settings-nav__item ${activeTab === 'data' ? 'is-active' : ''}`} onClick={() => setActiveTab('data')}>
                            <span className="settings-nav__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span> 
                            Данные
                        </button>
                        <button className={`settings-nav__item ${activeTab === 'security' ? 'is-active' : ''}`} onClick={() => setActiveTab('security')}>
                            <span className="settings-nav__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </span> 
                            Безопасность
                        </button>
                        <button className="settings-nav__item settings-nav__item--danger" onClick={logout}>
                            <span className="settings-nav__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </span> 
                            Выйти
                        </button>
                    </nav>

                    <hr className="settings-divider" style={{ margin: '24px 0' }} />
                    <div className="settings-sidebar-actions">
                        <button className="btn btn--primary btn--full btn--lg" onClick={handleSave}>Сохранить изменения</button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="settings-content">
                    {/* Mobile Navigation Tabs */}
                    <div className="settings-mobile-nav show-mobile">
                        <button className="settings-mobile-nav__menu-btn" onClick={toggleMenu}>
                            <MenuIcon size={20} />
                        </button>
                        <div className="settings-mobile-nav__tabs-scroll">
                            <button className={`settings-mobile-nav__tab ${activeTab === 'data' ? 'is-active' : ''}`} onClick={() => setActiveTab('data')}>
                                Данные
                            </button>
                            <button className={`settings-mobile-nav__tab ${activeTab === 'security' ? 'is-active' : ''}`} onClick={() => setActiveTab('security')}>
                                Безопасность
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Panel */}
                    <div className={`settings-mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
                        <div className="settings-mobile-menu__header">
                            <button className="settings-mobile-menu__close" onClick={() => setIsMenuOpen(false)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <nav className="settings-mobile-menu__nav">
                            <button className={`settings-mobile-menu__item ${activeTab === 'data' ? 'is-active' : ''}`} onClick={() => handleMenuTabClick('data')}>
                                <span className="settings-nav__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </span>
                                Данные
                            </button>
                            <button className={`settings-mobile-menu__item ${activeTab === 'security' ? 'is-active' : ''}`} onClick={() => handleMenuTabClick('security')}>
                                <span className="settings-nav__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </span>
                                Безопасность
                            </button>
                            <div className="settings-mobile-menu__divider"></div>
                            <button className="settings-mobile-menu__item settings-mobile-menu__item--danger" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                <span className="settings-nav__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                </span>
                                Выйти
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'data' && (
                        <div className="settings-section-list">
                            
                            {/* Фото профиля */}
                            <section className="settings-section">
                                <h3 className="settings-section__title">Фото профиля</h3>
                                <div className="settings-avatar-wrap">
                                    <div className="settings-avatar">
                                        {currentUser.avatar ? (
                                            <img src={currentUser.avatar} alt="Аватар" className="settings-avatar__img" />
                                        ) : (
                                            <div className="settings-avatar__placeholder">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                            </div>
                                        )}
                                        <button className="settings-avatar__btn" onClick={() => fileInputRef.current?.click()} title="Загрузить фото">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path></svg>
                                        </button>
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
                                    </div>
                                    <div className="settings-avatar-info">
                                        <p className="settings-avatar-info__main">Загрузите фотографию профиля</p>
                                        <span className="settings-avatar-info__sub">JPG, PNG, макс. 5MB</span>
                                    </div>
                                </div>
                            </section>

                            <hr className="settings-divider" />

                            {/* Личные данные */}
                            <section className="settings-section">
                                <h3 className="settings-section__title">Личные данные</h3>
                                <div className="settings-form-grid">
                                    <div className="settings-field">
                                        <label className="settings-label">Фамилия</label>
                                        <input type="text" className="settings-input" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                                    </div>
                                    <div className="settings-field">
                                        <label className="settings-label">Имя</label>
                                        <input type="text" className="settings-input" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                                    </div>
                                    <div className="settings-field">
                                        <label className="settings-label">Отчество</label>
                                        <input type="text" className="settings-input" value={form.middleName} onChange={e => setForm({...form, middleName: e.target.value})} />
                                    </div>
                                </div>
                            </section>

                            {isStudent && (
                                <>
                                    <hr className="settings-divider" />
                                    {/* Институт */}
                                    <section className="settings-section">
                                        <div className="settings-section__header-row">
                                            <h3 className="settings-section__title">Институт</h3>
                                            <span className="tag tag--neutral">Не подтверждён</span>
                                        </div>
                                        <div className="settings-form-grid">
                                            <div className="settings-field">
                                                <label className="settings-label">Название университета</label>
                                                <input type="text" className="settings-input" value={form.university} onChange={e => setForm({...form, university: e.target.value})} />
                                            </div>
                                            <div className="settings-field">
                                                <label className="settings-label">Направление</label>
                                                <input type="text" className="settings-input" value={form.direction} onChange={e => setForm({...form, direction: e.target.value})} />
                                            </div>
                                            <div className="settings-field settings-field--row-sm">
                                                <label className="settings-label">Курс</label>
                                                <div className="settings-course-selector">
                                                    {[1, 2, 3, 4, 5, 6].map(c => (
                                                        <button key={c} type="button" 
                                                            className={`settings-course-btn ${form.course === c ? 'is-active' : ''}`}
                                                            onClick={() => setForm({...form, course: c})}>
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="settings-field settings-field--align-start">
                                                <div className="settings-field-text">
                                                    <label className="settings-label">Подтверждение университета</label>
                                                    <span className="settings-field-hint">Загрузите документ, подтверждающий обучение в университете</span>
                                                </div>
                                                
                                                {proofFile ? (
                                                    <div className="settings-proof-preview">
                                                        <div className="settings-proof-info">
                                                            {proofFile.url ? (
                                                                <img src={proofFile.url} alt="Документ" className="settings-proof-img" />
                                                            ) : (
                                                                <div className="settings-proof-doc-icon">
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                                                </div>
                                                            )}
                                                            <span className="settings-proof-name" title={proofFile.name}>{proofFile.name}</span>
                                                        </div>
                                                        <button className="settings-proof-remove" onClick={handleRemoveProof} title="Открепить">
                                                            <ClearIcon size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="btn btn--outline settings-upload-btn" onClick={() => proofInputRef.current?.click()}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                                        Загрузить документ
                                                    </button>
                                                )}
                                                
                                                <input type="file" ref={proofInputRef} hidden onChange={handleProofChange} accept=".pdf,image/*" />
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="settings-divider" />
                                    {/* Хард скиллы */}
                                    <section className="settings-section">
                                        <h3 className="settings-section__title">Хард скиллы</h3>
                                        <div className="settings-skills" ref={skillInputRef}>
                                            {skills.map(sk => (
                                                <span key={sk} className="tag tag--it settings-skill-tag">
                                                    {sk} 
                                                    <button onClick={() => handleSkillRemove(sk)} style={{display: 'flex', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer', marginLeft: '-2px'}}><ClearIcon size={14} /></button>
                                                </span>
                                            ))}
                                            
                                            {showSkillOptions ? (
                                                <>
                                                    <span className="tag tag--it settings-skill-tag">
                                                        <input 
                                                            type="text" 
                                                            className="settings-skill-input-badge" 
                                                            placeholder="Скилл..." 
                                                            value={skillInput} 
                                                            onChange={e => setSkillInput(e.target.value)} 
                                                            onKeyDown={e => { if(e.key === 'Enter' && skillInput) handleSkillAdd(skillInput); }}
                                                            autoFocus
                                                        />
                                                    </span>
                                                    
                                                    {skillInput && (
                                                        <>
                                                            {predefinedSkills.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)).slice(0, 4).map(s => (
                                                                <button key={s} className="tag tag--neutral settings-skill-tag" onClick={() => handleSkillAdd(s)} style={{cursor: 'pointer'}}>
                                                                    {s}
                                                                </button>
                                                            ))}
                                                            {!predefinedSkills.some(s => s.toLowerCase() === skillInput.toLowerCase()) && (
                                                                <button className="tag tag--neutral settings-skill-tag" onClick={() => handleSkillAdd(skillInput)} style={{cursor: 'pointer', border: '1px dashed var(--Primitives--neutral--300)'}}>
                                                                    Добавить "{skillInput}"
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <button className="tag tag--it settings-skill-tag" onClick={() => setShowSkillOptions(true)} style={{cursor: 'pointer'}}>+ Добавить</button>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section-list">
                            <section className="settings-section">
                                <h3 className="settings-section__title">Безопасность</h3>
                                <p style={{color: 'var(--Primitives--neutral--500)'}}>Настройки безопасности в разработке.</p>
                            </section>
                        </div>
                    )}

                    {/* Fixed Mobile Save Button */}
                    {isDirty && (
                        <div className="settings-mobile-actions show-mobile">
                            <button className="btn btn--primary btn--lg" onClick={handleSave}>
                                Сохранить изменения
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
