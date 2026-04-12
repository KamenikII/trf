import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { IInternship } from "./types";
import { useInternships } from "./context/InternshipContext";
import { useAuth } from "./context/AuthContext";
import { useModals } from "./context/ModalContext";
import { useFilters } from "./context/FilterContext";
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { ScrollTopButton } from './components/scroll-top-button/ScrollTopButton';
import ScrollToTop from './components/ScrollToTop';
import { HomePage } from "./pages/HomePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

// Lazy-loaded modals — only loaded when first opened
const FilterModal = lazy(() => import('./components/filter-modal/FilterModal').then(m => ({ default: m.FilterModal })));
const PostModal = lazy(() => import('./components/post-modal/PostModal').then(m => ({ default: m.PostModal })));
const DetailModal = lazy(() => import('./components/detail-modal/DetailModal').then(m => ({ default: m.DetailModal })));
const AuthModal = lazy(() => import('./components/auth-modal/AuthModal').then(m => ({ default: m.AuthModal })));
const ConfirmModal = lazy(() => import('./components/confirm-modal/ConfirmModal').then(m => ({ default: m.ConfirmModal })));
const CreateOrgModal = lazy(() => import('./components/create-org-modal/CreateOrgModal').then(m => ({ default: m.CreateOrgModal })));

export default function App() {
  const { addInternship } = useInternships();
  const { currentUser, login } = useAuth();
  const location = useLocation();
  const { filters, setFilters } = useFilters();
  const {
    filterModalOpen, filterModalSection, closeFilterModal,
    postModalOpen, closePostModal,
    authModalOpen, closeAuthModal,
    createOrgModalOpen, closeCreateOrgModal,
    detailItem, closeDetail,
    toastVisible, toastMessage, showToast,
    confirmModal,
  } = useModals();

  const handlePostSubmit = (newInternship: IInternship) => {
    addInternship(newInternship);
    showToast();
  };

  const isCompanyProfile = currentUser?.role === 'company' && location.pathname.startsWith('/profile');

  return (
    <>
      <ScrollToTop />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage  />} />
          <Route path="/favorites" element={<FavoritesPage  />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {!isCompanyProfile && <Footer />}
      <ScrollTopButton />

      <Suspense fallback={null}>
        {filterModalOpen && (
          <FilterModal
            isOpen={filterModalOpen}
            initialSection={filterModalSection}
            filters={filters}
            
            onApply={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
            onClose={closeFilterModal}
          />
        )}

        {postModalOpen && (
          <PostModal
            isOpen={postModalOpen}
            onClose={closePostModal}
            onSubmit={handlePostSubmit}
          />
        )}

        {detailItem && (
          <DetailModal
            item={detailItem}
            isOpen={!!detailItem}
            onClose={closeDetail}
          />
        )}

        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={closeAuthModal}
            onLogin={login}
          />
        )}

        {confirmModal.isOpen && (
          <ConfirmModal />
        )}

        {createOrgModalOpen && (
          <CreateOrgModal 
            isOpen={createOrgModalOpen} 
            onClose={closeCreateOrgModal} 
          />
        )}
      </Suspense>

      {/* Success Toast */}
      <div className={`post-toast${toastVisible ? " is-visible" : ""}`} id="post-toast" role="status" aria-live="polite">
        <span className="post-toast__icon">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {toastMessage}
      </div>
    </>
  );
}
