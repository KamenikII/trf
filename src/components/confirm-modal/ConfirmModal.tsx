import { useModals } from "../../context/ModalContext";
import "./ConfirmModal.css";

export const ConfirmModal = () => {
    const { confirmModal, closeConfirm } = useModals();

    if (!confirmModal.isOpen) return null;

    const handleConfirm = () => {
        confirmModal.onConfirm();
        closeConfirm();
    };

    const handleCancel = () => {
        if (confirmModal.onCancel) confirmModal.onCancel();
        closeConfirm();
    };

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <div className="confirm-modal__header">
                    <h3 className="confirm-modal__title">{confirmModal.title}</h3>
                </div>
                <div className="confirm-modal__body">
                    <p className="confirm-modal__message">{confirmModal.message}</p>
                </div>
                <div className="confirm-modal__footer">
                    <button className="btn btn--outline btn--full" onClick={handleCancel}>
                        {confirmModal.cancelLabel || "Отмена"}
                    </button>
                    <button className="btn btn--primary btn--full" onClick={handleConfirm}>
                        {confirmModal.confirmLabel || "Продолжить"}
                    </button>
                </div>
            </div>
        </div>
    );
};
