import { ClearIcon, BackArrowIcon } from '../ui/Icons';

export interface EyeIconProps {
    closed?: boolean;
}

const EyeIcon = ({ closed }: EyeIconProps) => closed ? (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
) : (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export interface AuthClearableInputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    className?: string;
    required?: boolean;
}

export function AuthClearableInput({ type = "text", placeholder, value, onChange, onClear, className = "", required }: AuthClearableInputProps) {
    return (
        <div className="auth-input-wrapper">
            <input type={type} className={`input auth-input ${className}`} placeholder={placeholder}
                value={value} onChange={onChange} required={required} />
            {value && (
                <button type="button" className="auth-input-icon-btn" onClick={onClear} tabIndex={-1} title="Очистить">
                    <ClearIcon />
                </button>
            )}
        </div>
    );
}

export interface AuthPasswordInputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    showPassword?: boolean;
    onToggleShow: () => void;
}

export function AuthPasswordInput({ placeholder, value, onChange, onClear, showPassword, onToggleShow }: AuthPasswordInputProps) {
    return (
        <div className="auth-input-wrapper auth-input-wrapper--with-actions">
            <input type={showPassword ? "text" : "password"} className="input auth-input auth-input--with-actions"
                placeholder={placeholder} value={value} onChange={onChange} required />
            <div className="auth-input-actions">
                {value && (
                    <button type="button" className="auth-input-icon-btn" onClick={onClear} tabIndex={-1} title="Очистить">
                        <ClearIcon />
                    </button>
                )}
                <button type="button" className="auth-input-icon-btn" onClick={onToggleShow} tabIndex={-1}
                    title={showPassword ? "Скрыть пароль" : "Показать пароль"}>
                    <EyeIcon closed={showPassword} />
                </button>
            </div>
        </div>
    );
}

export interface RoleStepProps {
    role: string;
    onSelectRole: (role: string) => void;
}

export function RoleStep({ role, onSelectRole }: RoleStepProps) {
    return (
        <>
            <div className="auth-header auth-header--role">
                <h2 className="auth-title">Авторизация</h2>
            </div>
            <div className="auth-roles">
                <button className={`auth-role-card ${role === "student" ? "is-active" : ""}`}
                    onClick={() => onSelectRole("student")}>
                    <div className="auth-role-text">Студент </div>
                </button>
                <button className={`auth-role-card ${role === "company" ? "is-active" : ""}`}
                    onClick={() => onSelectRole("company")}>
                    <div className="auth-role-text">Организация</div>
                </button>
            </div>
        </>
    );
}

export interface EmailStepProps {
    email: string;
    setEmail: (email: string) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function EmailStep({ email, setEmail, onBack, onSubmit }: EmailStepProps) {
    return (
        <>
            <div className="auth-header">
                <button className="auth-back" onClick={onBack}><BackArrowIcon /></button>
                <h2 className="auth-title">Авторизация</h2>
            </div>
            <div className="auth-socials">
                <button className="btn btn--outline auth-social-btn">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Продолжить с Google
                </button>
            </div>
            <div className="auth-separator"><span>или</span></div>
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <AuthClearableInput type="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)} onClear={() => setEmail("")} required />
                </div>
                <button type="submit" className="btn btn--primary btn--full auth-submit">Продолжить с почтой</button>
            </form>
        </>
    );
}

export interface PasswordStepProps {
    flowType: "login" | "register" | null;
    password: string;
    setPassword: (v: string) => void;
    passwordConfirm: string;
    setPasswordConfirm: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    showPasswordConfirm: boolean;
    setShowPasswordConfirm: (v: boolean) => void;
    termsAccepted: boolean;
    setTermsAccepted: (v: boolean) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function PasswordStep({
    flowType, password, setPassword, passwordConfirm, setPasswordConfirm,
    showPassword, setShowPassword, showPasswordConfirm, setShowPasswordConfirm,
    termsAccepted, setTermsAccepted, onBack, onSubmit
}: PasswordStepProps) {
    return (
        <>
            <div className="auth-header">
                <button className="auth-back" onClick={onBack}><BackArrowIcon /></button>
                <h2 className="auth-title">{flowType === "login" ? "Введите пароль" : "Придумайте пароль"}</h2>
            </div>
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <AuthPasswordInput placeholder="Пароль" value={password}
                        onChange={(e) => setPassword(e.target.value)} onClear={() => setPassword("")}
                        showPassword={showPassword} onToggleShow={() => setShowPassword(!showPassword)} />
                </div>
                {flowType === "register" && (
                    <>
                        <div className="form-group">
                            <AuthPasswordInput placeholder="Повторите пароль" value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)} onClear={() => setPasswordConfirm("")}
                                showPassword={showPasswordConfirm} onToggleShow={() => setShowPasswordConfirm(!showPasswordConfirm)} />
                        </div>
                        <label className="auth-checkbox">
                            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                            <span className="auth-checkbox-text">
                                Я принимаю <a href="#">пользовательское соглашение</a> и даю согласие на обработку персональных данных
                            </span>
                        </label>
                    </>
                )}
                <button type="submit" className="btn btn--primary btn--full auth-submit"
                    disabled={flowType === "register" && (!password || password !== passwordConfirm || !termsAccepted)}>
                    Продолжить
                </button>
                {flowType === "login" && (<div className="auth-forgot"><a href="#">Забыли пароль?</a></div>)}
            </form>
        </>
    );
}

export interface FioStepProps {
    firstName: string;
    setFirstName: (v: string) => void;
    lastName: string;
    setLastName: (v: string) => void;
    middleName: string;
    setMiddleName: (v: string) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function FioStep({ firstName, setFirstName, lastName, setLastName, middleName, setMiddleName, onBack, onSubmit }: FioStepProps) {
    return (
        <>
            <div className="auth-header">
                <button className="auth-back" onClick={onBack}><BackArrowIcon /></button>
                <h2 className="auth-title">Расскажите о себе</h2>
            </div>
            <form onSubmit={onSubmit} className="auth-form auth-fio-form">
                <div className="form-group">
                    <label className="form-label">Фамилия <span className="required">*</span></label>
                    <AuthClearableInput placeholder="Иванов" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} onClear={() => setLastName("")} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Имя <span className="required">*</span></label>
                    <AuthClearableInput placeholder="Иван" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} onClear={() => setFirstName("")} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Отчество</label>
                    <AuthClearableInput placeholder="Иванович" value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)} onClear={() => setMiddleName("")} />
                </div>
                <button type="submit" className="btn btn--primary btn--full auth-submit" disabled={!lastName || !firstName}>
                    Завершить регистрацию
                </button>
            </form>
        </>
    );
}
