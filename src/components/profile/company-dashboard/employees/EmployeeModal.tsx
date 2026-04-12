import './EmployeeModal.css';
import { useState, useEffect } from "react";
import { IEmployee } from "../../../../types";
import { useBodyLock } from "../../../../hooks/useBodyLock";
import { useEscapeClose } from "../../../../hooks/useEscapeClose";
import { useFocusTrap } from "../../../../hooks/useFocusTrap";

export interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<IEmployee>) => void;
    initialData: IEmployee | null;
}

export const EmployeeModal = ({ isOpen, onClose, onSubmit, initialData }: EmployeeModalProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFirstName(initialData.firstName || "");
                setLastName(initialData.lastName || "");
                setRole(initialData.role || "");
            } else {
                setFirstName("");
                setLastName("");
                setRole("");
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    useBodyLock(isOpen);
    useEscapeClose(isOpen, onClose);
    const trapRef = useFocusTrap(isOpen);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!firstName.trim()) newErrors.firstName = "Укажите имя";
        if (!lastName.trim()) newErrors.lastName = "Укажите фамилию";
        if (!role.trim()) newErrors.role = "Укажите должность";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ firstName, lastName, role });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
      <div className="modal is-open" role="dialog" aria-modal="true" ref={trapRef}>
        <div className="modal__overlay" onClick={onClose} />
        <div className="modal__panel">
          <div className="modal__header">
            <h3 className="modal__title">
                {initialData ? "Редактировать сотрудника" : "Добавить сотрудника"}
            </h3>
            <button className="modal__close" onClick={onClose} aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="modal__body">
            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="modal-form__group">
                <label className="modal-form__label" htmlFor="firstName">Имя</label>
                <input 
                    type="text" 
                    id="firstName" 
                    placeholder="Иван"
                    className={`modal-form__input${errors.firstName ? " is-error" : ""}`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                {errors.firstName && <span className="modal-form__error">{errors.firstName}</span>}
              </div>

              <div className="modal-form__group">
                <label className="modal-form__label" htmlFor="lastName">Фамилия</label>
                <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Иванов"
                    className={`modal-form__input${errors.lastName ? " is-error" : ""}`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)} 
                />
                {errors.lastName && <span className="modal-form__error">{errors.lastName}</span>}
              </div>

              <div className="modal-form__group">
                <label className="modal-form__label" htmlFor="role">Должность</label>
                <input 
                    type="text" 
                    id="role" 
                    placeholder="HR-менеджер"
                    className={`modal-form__input${errors.role ? " is-error" : ""}`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)} 
                />
                {errors.role && <span className="modal-form__error">{errors.role}</span>}
              </div>
            </form>
          </div>

          <div className="modal__footer">
            <button className="btn btn--ghost modal__cancel" onClick={onClose}>Отмена</button>
            <button className="btn btn--primary modal__submit" onClick={handleSubmit}>
                {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    );
};
