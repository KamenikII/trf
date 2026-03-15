import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
    detailItem: IInternship | null;
    openDetail: (item: IInternship) => void;
    closeDetail: () => void;
    toastVisible: boolean;
    showToast: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filterModalSection, setFilterModalSection] = useState("sort");
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [detailItem, setDetailItem] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);

    const openFilterModal = useCallback((section?: string) => {
        setFilterModalSection(section || "sort");
        setFilterModalOpen(true);
    }, []);

    const closeFilterModal = useCallback(() => setFilterModalOpen(false), []);

    const openPostModal = useCallback(() => setPostModalOpen(true), []);
    const closePostModal = useCallback(() => setPostModalOpen(false), []);

    const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

    const openDetail = useCallback((item: IInternship) => setDetailItem(item), []);
    const closeDetail = useCallback(() => setDetailItem(null), []);

    const showToast = useCallback(() => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    }, []);

    return (
        <ModalContext.Provider value={{
            filterModalOpen, filterModalSection, openFilterModal, closeFilterModal,
            postModalOpen, openPostModal, closePostModal,
            authModalOpen, openAuthModal, closeAuthModal,
            detailItem, openDetail, closeDetail,
            toastVisible, showToast,
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
