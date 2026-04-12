import './CreateOrgModal.css';
import { useState } from "react";
import { CloseIcon } from '../ui/Icons';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useEscapeClose } from '../../hooks/useEscapeClose';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useModals } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';

export interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrgModal = ({ isOpen, onClose }: CreateOrgModalProps) => {
    const { showToast } = useModals();
    const { updateProfile } = useAuth();
    const [name, setName] = useState("");
    const [inn, setInn] = useState("");
    const [isEducational, setIsEducational] = useState(false);

    const resetAndClose = () => {
        setName("");
        setInn("");
        setIsEducational(false);
        onClose();
    };

    useBodyLock(isOpen);
    useEscapeClose(isOpen, resetAndClose);
    const trapRef = useFocusTrap(isOpen);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !inn) return;
        
        updateProfile({ 
            companyName: name,
            isEducational: isEducational
        });
        showToast("Организация успешно создана!");
        resetAndClose();
    };

    return (
        <div className="create-org-modal__overlay is-open" onClick={resetAndClose} role="dialog" aria-modal="true" ref={trapRef}>
            <div className="create-org-modal__box" onClick={(e) => e.stopPropagation()}>
                <button className="create-org-modal__close" onClick={resetAndClose} aria-label="Закрыть">
                    <CloseIcon />
                </button>
                <h2 className="create-org-modal__title">Создать организацию</h2>
                
                <form className="create-org-form" onSubmit={handleSubmit}>
                    <div className="create-org-form__group">
                        <label className="create-org-form__label">
                            Название организации <span className="create-org-form__req">*</span>
                        </label>
                        <input 
                            type="text" 
                            className="create-org-form__input" 
                            placeholder="Например: Яндекс"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <label className="create-org-form__checkbox-label" style={{ marginTop: '-4px', marginBottom: '8px' }}>
                        <input 
                            type="checkbox" 
                            className="create-org-form__checkbox"
                            checked={isEducational}
                            onChange={(e) => setIsEducational(e.target.checked)}
                        />
                        <span className="create-org-form__checkbox-text">Является учебным заведением</span>
                    </label>

                    <div className="create-org-form__group">
                        <label className="create-org-form__label">
                            ИНН <span className="create-org-form__req">*</span>
                        </label>
                        <input 
                            type="text" 
                            className="create-org-form__input" 
                            placeholder="Например: 7736207543"
                            value={inn}
                            onChange={(e) => setInn(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn--primary create-org-modal__submit">
                        Создать организацию
                    </button>
                </form>
            </div>
        </div>
    );
};
