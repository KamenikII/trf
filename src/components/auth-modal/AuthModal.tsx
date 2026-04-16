import './AuthModal.css';
import { useState } from "react";
import { getUserByEmail, addUser } from '../../data/users';
import { BackArrowIcon, CloseIcon } from '../ui/Icons';
import { RoleStep, EmailStep, PasswordStep, FioStep } from './AuthSteps';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useEscapeClose } from '../../hooks/useEscapeClose';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: IUser) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
    const [step, setStep] = useState("role");
    const [flowType, setFlowType] = useState(null);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [existingUser, setExistingUser] = useState(null);

    if (!isOpen) return null;

    const resetAndClose = () => {
        setStep("role"); setFlowType(null); setEmail(""); setRole("");
        setPassword(""); setPasswordConfirm("");
        setShowPassword(false); setShowPasswordConfirm(false);
        setTermsAccepted(false); setFirstName(""); setLastName("");
        setMiddleName(""); setExistingUser(null);
        onClose();
    };

    const handleRoleSubmit = (selectedRole) => {
        setRole(selectedRole);
        setStep("email");
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        const user = getUserByEmail(email);
        if (user) {
            if (user.role !== role && user.role !== 'admin') {
                alert(`Этот email уже зарегистрирован как ${user.role === "student" ? "студент" : "организация"}`);
                return;
            }
            setExistingUser(user);
            setFlowType("login");
        } else {
            setFlowType("register");
        }
        setStep("password");
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (flowType === "login") {
            if (!password) return;
            if (existingUser.password === password) { onLogin(existingUser); resetAndClose(); }
            else alert("Неверный пароль");
        } else {
            if (!password || password !== passwordConfirm || !termsAccepted) return;
            setStep("fio");
        }
    };

    const handleFioSubmit = (e) => {
        e.preventDefault();
        if (!firstName || !lastName) return;
        const newUser = addUser({ email, password, role, firstName, lastName, middleName });
        onLogin(newUser);
        resetAndClose();
    };

    useBodyLock(isOpen);
    useEscapeClose(isOpen, resetAndClose);
    const trapRef = useFocusTrap(isOpen);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay is-open" onClick={resetAndClose} role="dialog" aria-modal="true" ref={trapRef}>
            <div className="modal auth-modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={resetAndClose} aria-label="Закрыть">
                    <CloseIcon />
                </button>
                <div className="auth-content">
                    {step === "role" && <RoleStep role={role} onSelectRole={handleRoleSubmit} />}
                    {step === "email" && (
                        <EmailStep email={email} setEmail={setEmail}
                            onBack={() => setStep("role")} onSubmit={handleEmailSubmit} />
                    )}
                    {step === "password" && (
                        <PasswordStep
                            flowType={flowType}
                            password={password} setPassword={setPassword}
                            passwordConfirm={passwordConfirm} setPasswordConfirm={setPasswordConfirm}
                            showPassword={showPassword} setShowPassword={setShowPassword}
                            showPasswordConfirm={showPasswordConfirm} setShowPasswordConfirm={setShowPasswordConfirm}
                            termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted}
                            onBack={() => setStep("email")} onSubmit={handlePasswordSubmit} />
                    )}
                    {step === "fio" && (
                        <FioStep
                            firstName={firstName} setFirstName={setFirstName}
                            lastName={lastName} setLastName={setLastName}
                            middleName={middleName} setMiddleName={setMiddleName}
                            onBack={() => setStep("password")} onSubmit={handleFioSubmit} />
                    )}
                </div>
            </div>
        </div>
    );
}
