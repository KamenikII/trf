import { useModals } from '../../../context/ModalContext';
import './CompanyProfileEmpty.css';

export const CompanyProfileEmpty = () => {
    const { openCreateOrgModal } = useModals();
    return (
        <div className="company-profile-empty">
            <h1 className="company-profile-empty__title">Моя организация</h1>
            <p className="company-profile-empty__subtitle">
                Для публикации стажировок и управления откликами необходимо создать профиль организации или присоединиться к существующей.
            </p>
            
            <div className="company-profile-empty__cards">
                <button className="company-profile-empty__card" onClick={openCreateOrgModal}>
                    <div className="company-profile-empty__card-icon">
                        {/* Иконка создания */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="company-profile-empty__card-title">Создать организацию</h3>
                    <p className="company-profile-empty__card-desc">
                        Добавьте новую компанию, если вы являетесь владельцем или администратором.
                    </p>
                </button>
                
                <button className="company-profile-empty__card">
                    <div className="company-profile-empty__card-icon">
                        {/* Иконка присоединения */}
                         <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M17 20h5V16c0-2-3-3-5-3M16 3.13a4 4 0 010 7.75M9 14.5c0 0-4.5 1-4.5 4.5v1.5h9v-1.5c0-3.5-4.5-4.5-4.5-4.5zM9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="company-profile-empty__card-title">Присоединиться</h3>
                    <p className="company-profile-empty__card-desc">
                        Отправьте заявку на вступление, если компания уже зарегистрирована на платформе.
                    </p>
                </button>
            </div>
        </div>
    );
};
