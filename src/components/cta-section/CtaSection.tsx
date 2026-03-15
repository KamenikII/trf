import './CtaSection.css';
import { useModals } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';

export const CtaSection = () => {
  const { openPostModal } = useModals();
  const { currentUser } = useAuth();
  const isStudent = currentUser?.role === "student";

  if (isStudent) return null;

  return (
    <section className="cta-section" id="cta-section">
      <div className="cta-section__inner">
        <h2 className="cta-section__title">Вы представляете компанию?</h2>
        <p className="cta-section__text">
          Размещайте стажировки бесплатно и находите лучших студентов{" "}
          <br className="hide-mobile" />
          из ведущих вузов России
        </p>
        <button className="btn btn--primary btn--lg" id="btn-post-internship"
          onClick={(e) => { e.preventDefault(); openPostModal(); }}>
          Разместить стажировку
        </button>
      </div>
    </section>
  );
}
