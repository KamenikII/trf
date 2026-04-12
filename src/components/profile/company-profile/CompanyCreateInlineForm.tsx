import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useModals } from "../../../context/ModalContext";
import "../../create-org-modal/CreateOrgModal.css";

export const CompanyCreateInlineForm = () => {
    const { updateProfile } = useAuth();
    const { showToast } = useModals();
    const [name, setName] = useState("");
    const [inn, setInn] = useState("");
    const [isEducational, setIsEducational] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !inn) return;
        
        updateProfile({ 
            companyName: name,
            isEducational: isEducational
        });
        showToast("Организация успешно создана!");
    };

    return (
        <div style={{ maxWidth: '440px', width: '100%', margin: '60px auto', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--Primitives--neutral--200)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--Primitives--neutral--950)', marginBottom: '8px', textAlign: 'center' }}>
                Создание профиля
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--Primitives--neutral--500)', textAlign: 'center', marginBottom: '32px' }}>
                Для доступа к дашборду необходимо зарегистрировать организацию
            </p>
            
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
                
                <label className="create-org-form__checkbox-label" style={{ marginTop: '-4px', marginBottom: '16px' }}>
                    <input 
                        type="checkbox" 
                        className="create-org-form__checkbox"
                        checked={isEducational}
                        onChange={(e) => setIsEducational(e.target.checked)}
                    />
                    <span className="create-org-form__checkbox-text">Является учебным заведением (ВУЗ, Колледж)</span>
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
                
                <button type="submit" className="btn btn--primary" style={{ width: '100%', height: '44px', marginTop: '8px' }}>
                    Создать
                </button>
            </form>
        </div>
    );
};
