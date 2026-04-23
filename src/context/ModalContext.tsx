import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { IInternship } from "../types";

export interface ModalContextType {
    filterModalOpen: boolean;
    filterModalSection: string;
    openFilterModal: (section?: string) => void;
    closeFilterModal: () => void;
    postModalOpen: boolean;
    openPostModal: () => void;
    closePostModal: () => void;
    authModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    createOrgModalOpen: boolean;
    openCreateOrgModal: () => void;
    closeCreateOrgModal: () => void;
    detailItem: IInternship | null;
    openDetail: (item: IInternship) => void;
    closeDetail: () => void;
    toastVisible: boolean;
    toastMessage: string;
    showToast: (msg?: string) => void;
    confirmModal: { 
        isOpen: boolean; 
        title: string; 
        message: string; 
        onConfirm: () => void;
        onCancel?: () => void;
        confirmLabel?: string;
        cancelLabel?: string;
        variant?: 'primary' | 'danger';
    };
    openConfirm: (options: { 
        title: string; 
        message: string; 
        onConfirm: () => void;
        onCancel?: () => void;
        confirmLabel?: string;
        cancelLabel?: string;
        variant?: 'primary' | 'danger';
    }) => void;
    closeConfirm: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filterModalSection, setFilterModalSection] = useState("sort");
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [createOrgModalOpen, setCreateOrgModalOpen] = useState(false);
    const [detailItem, setDetailItem] = useState<IInternship | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("Стажировка успешно опубликована!");
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
        confirmLabel: string;
        cancelLabel: string;
        variant: 'primary' | 'danger';
    }>({ 
        isOpen: false, 
        title: "", 
        message: "", 
        onConfirm: () => {},
        onCancel: () => {},
        confirmLabel: "Подтвердить",
        cancelLabel: "Отмена",
        variant: 'primary'
    });

    const openFilterModal = useCallback((section?: string) => {
        setFilterModalSection(section || "sort");
        setFilterModalOpen(true);
    }, []);

    const closeFilterModal = useCallback(() => setFilterModalOpen(false), []);

    const openPostModal = useCallback(() => setPostModalOpen(true), []);
    const closePostModal = useCallback(() => setPostModalOpen(false), []);

    const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

    const openCreateOrgModal = useCallback(() => setCreateOrgModalOpen(true), []);
    const closeCreateOrgModal = useCallback(() => setCreateOrgModalOpen(false), []);

    const openDetail = useCallback((item: IInternship) => setDetailItem(item), []);
    const closeDetail = useCallback(() => setDetailItem(null), []);

    const showToast = useCallback((msg = "Стажировка успешно опубликована!") => {
        setToastMessage(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    }, []);

    const openConfirm = useCallback((options: { 
        title: string; 
        message: string; 
        onConfirm: () => void;
        onCancel?: () => void;
        confirmLabel?: string;
        cancelLabel?: string;
        variant?: 'primary' | 'danger';
    }) => {
        setConfirmModal({
            isOpen: true,
            title: options.title,
            message: options.message,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel || (() => {}),
            confirmLabel: options.confirmLabel || "Подтвердить",
            cancelLabel: options.cancelLabel || "Отмена",
            variant: options.variant || 'primary'
        });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{
            filterModalOpen, filterModalSection, openFilterModal, closeFilterModal,
            postModalOpen, openPostModal, closePostModal,
            authModalOpen, openAuthModal, closeAuthModal,
            createOrgModalOpen, openCreateOrgModal, closeCreateOrgModal,
            detailItem, openDetail, closeDetail,
            toastVisible, toastMessage, showToast,
            confirmModal, openConfirm, closeConfirm
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModals() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModals must be used within ModalProvider");
    return ctx;
}
