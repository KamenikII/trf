import { useState } from "react";
import { IEmployee, IJoinCode } from "../../../../types";
import { useModals } from "../../../../context/ModalContext";
import { useAuth } from "../../../../context/AuthContext";
import { EmployeeModal } from "./EmployeeModal";
import { GenerateCodeModal } from "./GenerateCodeModal";
import "./EmployeesPage.css";

// Icons
const TrashIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const EditIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const PlusIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const RefreshIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const EyeIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const CopyIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;

export const EmployeesPage = () => {
    const { openConfirm, showToast } = useModals();
    const { currentUser } = useAuth();
    
    // Mock Data
    const [employees, setEmployees] = useState<IEmployee[]>([
        { id: "1", firstName: "Александр", lastName: "Иванов", role: "HR-директор" },
        { id: "2", firstName: "Мария", lastName: "Петрова", role: "Ведущий рекрутер" },
        { id: "3", firstName: "Дмитрий", lastName: "Сидоров", role: "HR-менеджер" },
    ]);

    const [generalCode, setGeneralCode] = useState<string>("XYZ-789");
    const [isGeneralCodeVisible, setIsGeneralCodeVisible] = useState(false);
    const [personalCodes, setPersonalCodes] = useState<IJoinCode[]>([]);
    const [visiblePersonalCodeIds, setVisiblePersonalCodeIds] = useState<Set<string>>(new Set());
    
    // Modal states
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isGenerateCodeModalOpen, setIsGenerateCodeModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);

    // Employee actions
    const handleDeleteEmployee = (id: string, name: string) => {
        openConfirm({
            title: "Удаление сотрудника",
            message: `Вы действительно хотите удалить сотрудника ${name}?`,
            confirmLabel: "Удалить",
            variant: "danger",
            onConfirm: () => {
                setEmployees(prev => prev.filter(e => e.id !== id));
                showToast("Сотрудник удален");
            }
        });
    };

    const handleOpenEdit = (employee: IEmployee) => {
        setEditingEmployee(employee);
        setIsEmployeeModalOpen(true);
    };

    const handleEmployeeSubmit = (data: Partial<IEmployee>) => {
        if (editingEmployee) {
            setEmployees(prev => prev.map(e => 
                e.id === editingEmployee.id ? { ...e, ...data } : e
            ));
            showToast("Данные сотрудника обновлены");
        } else {
            const newEmployee: IEmployee = {
                id: Math.random().toString(),
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                role: data.role || "HR-специалист",
            };
            setEmployees(prev => [...prev, newEmployee]);
            showToast("Сотрудник добавлен");
        }
    };

    // Code actions
    const handleRegenerateGeneralCode = () => {
        openConfirm({
            title: "Смена общего кода",
            message: "При генерации нового кода предыдущий перестанет работать. Продолжить?",
            confirmLabel: "Сгенерировать новый",
            variant: "danger",
            onConfirm: () => {
                const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                setGeneralCode(newCode);
                setIsGeneralCodeVisible(true);
                showToast("Общий код обновлен");
            }
        });
    };

    const handlePersonalCodeSubmit = (targetName: string) => {
        const newCode: IJoinCode = {
            id: Math.random().toString(),
            code: Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 4).toUpperCase(),
            type: 'personal',
            targetName: targetName,
            createdAt: new Date().toISOString()
        };
        setPersonalCodes(prev => [newCode, ...prev]);
        showToast("Личный код для " + targetName + " создан");
    };

    const handleDeletePersonalCode = (id: string, targetName?: string) => {
        openConfirm({
            title: "Удаление кода",
            message: `Удалить личный код для ${targetName || 'сотрудника'}?`,
            confirmLabel: "Удалить",
            variant: "danger",
            onConfirm: () => {
                setPersonalCodes(prev => prev.filter(c => c.id !== id));
                showToast("Личный код удален");
            }
        });
    };

    const handleActivateCode = (code: IJoinCode) => {
        const names = code.targetName?.split(' ') || ['Новый', 'HR'];
        const newEmployee: IEmployee = {
            id: Math.random().toString(),
            firstName: names[0],
            lastName: names.slice(1).join(' ') || 'Специалист',
            role: "HR-специалист",
        };
        setEmployees(prev => [...prev, newEmployee]);
        setPersonalCodes(prev => prev.filter(c => c.id !== code.id));
        showToast(`Сотрудник ${code.targetName} активирован`);
    };

    const togglePersonalCodeVisibility = (id: string) => {
        const newSet = new Set(visiblePersonalCodeIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setVisiblePersonalCodeIds(newSet);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Код скопирован в буфер");
    };

    return (
        <div className="employees-page">
            <header className="employees-header">
                <h2 className="employees-header__title">Сотрудники</h2>
                <p className="employees-header__desc">Управление командой {currentUser?.companyName}.</p>
            </header>

            {/* Codes Management */}
            <section className="codes-section">
                <div className="employees-header">
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Коды приглашения</h3>
                    <p className="employees-header__desc">Используйте коды, чтобы сотрудники могли присоединиться к вашей организации.</p>
                </div>

                <div className="codes-grid">
                    {/* General Code */}
                    <div className="code-card">
                        <div className="code-card__header">
                            <span className="code-card__label">Общий код</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button className="employee-action-btn" onClick={() => setIsGeneralCodeVisible(!isGeneralCodeVisible)} title={isGeneralCodeVisible ? "Скрыть" : "Показать"}>
                                    {isGeneralCodeVisible ? EyeOffIcon : EyeIcon}
                                </button>
                                <button className="employee-action-btn" onClick={handleRegenerateGeneralCode} title="Обновить код">
                                    {RefreshIcon}
                                </button>
                            </div>
                        </div>
                        <div className={`code-card__value${!isGeneralCodeVisible ? " code-card__value--hidden" : ""}`} onClick={() => isGeneralCodeVisible && copyToClipboard(generalCode)} style={{ cursor: isGeneralCodeVisible ? 'pointer' : 'default' }}>
                            {generalCode}
                        </div>
                        <div className="code-card__warning">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Новый код деактивирует старый
                        </div>
                    </div>

                    {/* Personal Code Creation */}
                    <div className="code-card code-card--create" onClick={() => setIsGenerateCodeModalOpen(true)}>
                        <div className="code-card__plus-box">
                            {PlusIcon}
                        </div>
                        <span className="code-card__create-text">Создать личный код</span>
                    </div>
                </div>
            </section>

            {/* Employees List */}
            <section className="employees-list-section">
                <div className="employees-header" style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Список сотрудников</h3>
                </div>

                <div className="employees-list">
                    {/* Active Employees */}
                    {employees.map(employee => (
                        <div key={employee.id} className="employee-item">
                            <div className="employee-item__avatar">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </div>
                            <div className="employee-item__info">
                                <div className="employee-item__name">{employee.firstName} {employee.lastName}</div>
                                <div className="employee-item__role">{employee.role}</div>
                            </div>
                            <div className="employee-item__actions">
                                <button 
                                    className="employee-action-btn" 
                                    onClick={() => handleOpenEdit(employee)}
                                    title="Редактировать"
                                >
                                    {EditIcon}
                                </button>
                                <button 
                                    className="employee-action-btn employee-action-btn--danger" 
                                    onClick={() => handleDeleteEmployee(employee.id, `${employee.firstName} ${employee.lastName}`)}
                                    title="Удалить"
                                >
                                    {TrashIcon}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pending Invitations (Expected Employees) */}
                    {personalCodes.map(code => (
                        <div key={code.id} className="employee-item employee-item--pending">
                            <div className="employee-item__avatar employee-item__avatar--pending">
                                {code.targetName?.charAt(0)}
                            </div>
                            <div className="employee-item__info">
                                <div className="employee-item__name">{code.targetName}</div>
                                <div className="employee-item__role">Ожидаемый сотрудник</div>
                            </div>
                            
                            <div className="employee-item__code-area">
                                <div className="code-input-group">
                                    <input 
                                        type={visiblePersonalCodeIds.has(code.id) ? "text" : "password"} 
                                        className="code-input" 
                                        value={code.code} 
                                        readOnly 
                                        onClick={() => visiblePersonalCodeIds.has(code.id) && copyToClipboard(code.code)}
                                    />
                                    <button className="code-input-btn" onClick={() => togglePersonalCodeVisibility(code.id)}>
                                        {visiblePersonalCodeIds.has(code.id) ? EyeOffIcon : EyeIcon}
                                    </button>
                                    <button className="code-input-btn" onClick={() => copyToClipboard(code.code)}>
                                        {CopyIcon}
                                    </button>
                                </div>
                            </div>

                            <div className="employee-item__actions">
                                <button 
                                    className="employee-action-btn" 
                                    onClick={() => handleActivateCode(code)}
                                    title="Активировать"
                                >
                                    {RefreshIcon}
                                </button>
                                <button 
                                    className="employee-action-btn employee-action-btn--danger" 
                                    onClick={() => handleDeletePersonalCode(code.id, code.targetName)}
                                    title="Удалить"
                                >
                                    {TrashIcon}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <EmployeeModal 
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
                onSubmit={handleEmployeeSubmit}
                initialData={editingEmployee}
            />

            <GenerateCodeModal 
                isOpen={isGenerateCodeModalOpen}
                onClose={() => setIsGenerateCodeModalOpen(false)}
                onSubmit={handlePersonalCodeSubmit}
            />
        </div>
    );
};
