
import { useModals } from "../context/ModalContext";
import { useFilters } from "../context/FilterContext";
import { useAuth } from "../context/AuthContext";
import { Hero } from '../components/hero/Hero';
import { Board } from '../components/board/Board';
import { CtaSection } from '../components/cta-section/CtaSection';


export const HomePage = () => {
    const { filters, setFilters } = useFilters();
    const { openFilterModal, openDetail } = useModals();
    const { currentUser } = useAuth();

    return (
        <>
            {!currentUser && <Hero />}
            <Board
                filters={filters}
                onFiltersChange={setFilters}
                onOpenDetail={openDetail}
                onOpenFilter={openFilterModal}
            />
            <CtaSection />
        </>
    );
}
