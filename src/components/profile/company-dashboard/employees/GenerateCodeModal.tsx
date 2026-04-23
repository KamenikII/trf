import './GenerateCodeModal.css';
import { useState, useEffect } from "react";
import { useBodyLock } from "../../../../hooks/useBodyLock";
import { useEscapeClose } from "../../../../hooks/useEscapeClose";
import { useFocusTrap } from "../../../../hooks/useFocusTrap";

export interface GenerateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (targetName: string) => void;
}

export const GenerateCodeModal = ({ isOpen, onClose, onSubmit }: GenerateCodeModalProps) => {
    const [targetName, setTargetName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTargetName("");
            setError("");
        }
    }, [isOpen]);

    useBodyLock(isOpen);
    useEscapeClose(isOpen, onClose);
    const trapRef = useFocusTrap(isOpen);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetName.trim()) {
            setError("Укажите имя сотрудника");
            return;
        }
        onSubmit(targetName);
        onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="modal is-open" role="dialog" aria-modal="true" ref={trapRef}>
        <div className="modal__overlay" onClick={onClose} />
        <div className="modal__panel">
          <div className="modal__header">
            <h3 className="modal__title">Создать личный код</h3>
            <button className="modal__close" onClick={onClose} aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="modal__body">
            <p className="modal__desc" style={{ marginBottom: '16px', color: 'var(--Primitives--neutral--500)', fontSize: '14px' }}>
                Личный код будет привязан к конкретному сотруднику. Это поможет отследить, кто именно присоединился к организации.
            </p>
            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="modal-form__group">
                <label className="modal-form__label" htmlFor="targetName">ФИО сотрудника</label>
                <input 
                    type="text" 
                    id="targetName" 
                    placeholder="Пример: Иванов Иван Иванович"
                    className={`modal-form__input${error ? " is-error" : ""}`}
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    autoFocus
                />
                {error && <span className="modal-form__error">{error}</span>}
              </div>
            </form>
          </div>

          <div className="modal__footer">
            <button className="btn btn--ghost modal__cancel" onClick={onClose}>Отмена</button>
            <button className="btn btn--primary modal__submit" onClick={handleSubmit}>
                Создать код
            </button>
          </div>
        </div>
      </div>
    );
};
