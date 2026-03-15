import './DetailModal.css';
import { useState, useEffect } from "react";
import { formatDeadline, getDirections, getCategoryClass } from '../../utils/helpers';
import { CloseIcon } from '../ui/Icons';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useEscapeClose } from '../../hooks/useEscapeClose';
import { useFocusTrap } from '../../hooks/useFocusTrap';

function renderDirectionTags(item) {
  const dirs = getDirections(item);
  return dirs.map((d, i) => {
    const cls = getCategoryClass(d.category);
    return <span key={i} className={`tag tag--${cls}`}>{d.subcategory || d.category}</span>;
  });
}

export interface DetailModalProps {
  item: IInternship;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailModal = ({ item, isOpen, onClose }: DetailModalProps) => {
  const [copyToast, setCopyToast] = useState(false);
  const [copyText, setCopyText] = useState("");

  useEscapeClose(isOpen, onClose);
  useBodyLock(isOpen);
  const trapRef = useFocusTrap(isOpen);

  const handleCta = (e) => {
    e.preventDefault();
    if (!item?.contact) return;
    const contact = item.contact;
    navigator.clipboard.writeText(contact).then(() => {
      setCopyText(`Скопировано: ${contact}`);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = contact;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopyText(`Скопировано: ${contact}`);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    });
  };

  if (!isOpen || !item) return null;

  const dl = item.deadline ? formatDeadline(item.deadline) : null;
  const allCitiesArr = Array.isArray(item.city) ? item.city : (item.city ? [item.city] : []);

  return (
    <div className="detail-modal is-open" id="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title" ref={trapRef}>
      <div className="detail-modal__overlay" onClick={onClose} />
      <div className="detail-modal__panel">
        <div className="detail-modal__header">
          <div className="detail-modal__company">
            <div className="detail-modal__avatar">
              {item.logo
                ? <img src={item.logo} alt={item.company} />
                : item.avatar
              }
            </div>
            <span className="detail-modal__company-name">{item.company}</span>
          </div>
          <button className="detail-modal__close" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        <div className="detail-modal__body">
          <h2 className="detail-modal__title">{item.position}</h2>

          {/* Meta row */}
          <div className="detail-modal__meta">
            {item.salaryNum ? (
              <span className="detail-modal__meta-item detail-modal__meta-item--salary">
                <svg className="detail-modal__meta-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {item.salary}
              </span>
            ) : null}
            {dl ? (
              <span className="detail-modal__meta-item">
                <svg className="detail-modal__meta-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 1.5v2M11 1.5v2M2.5 6h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                до {dl.text}
              </span>
            ) : null}
            {allCitiesArr.length > 0 ? (
              <span className="detail-modal__meta-item">
                <svg className="detail-modal__meta-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C5.1 1.5 2.75 3.85 2.75 6.75C2.75 10.5 8 14.5 8 14.5C8 14.5 13.25 10.5 13.25 6.75C13.25 3.85 10.9 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="6.75" r="1.75" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                {allCitiesArr.join(", ")}
              </span>
            ) : null}
          </div>

          {/* Tags */}
          <div className="detail-modal__tags">
            {renderDirectionTags(item)}
            {item.format && <span className="tag tag--neutral">{item.format}</span>}
            {item.employment && <span className="tag tag--neutral">{item.employment}</span>}
            {item.experience && <span className="tag tag--neutral">{item.experience}</span>}
            {dl && (dl.isSoon || dl.isPast) && (
              <span className="tag tag--neutral">🔥 {dl.isPast ? "Истёк" : "Скоро"}</span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="detail-modal__description">
              <h4 className="detail-modal__section-title">Описание</h4>
              <p className="detail-modal__desc-text">{item.description}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="detail-modal__info-grid">
            <div className="detail-modal__info-item">
              <span className="detail-modal__info-label">Компания</span>
              <span className="detail-modal__info-value">{item.company}</span>
            </div>
            {allCitiesArr.length > 0 && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Город</span>
                <span className="detail-modal__info-value">{allCitiesArr.join(", ")}</span>
              </div>
            )}
            {item.format && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Формат</span>
                <span className="detail-modal__info-value">{item.format}</span>
              </div>
            )}
            {item.employment && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Занятость</span>
                <span className="detail-modal__info-value">{item.employment}</span>
              </div>
            )}
            {item.experience && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Опыт</span>
                <span className="detail-modal__info-value">{item.experience}</span>
              </div>
            )}
            {dl && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Дедлайн</span>
                <span className="detail-modal__info-value">до {dl.text}</span>
              </div>
            )}
            {item.salary && (
              <div className="detail-modal__info-item">
                <span className="detail-modal__info-label">Зарплата</span>
                <span className="detail-modal__info-value">{item.salary}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-modal__footer">
          <button className="btn btn--ghost detail-modal__close-btn" onClick={onClose}>Закрыть</button>
          {item.contact && (
            <button className="btn btn--primary detail-modal__cta" onClick={handleCta}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="8" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
                <path d="M11 3H4.3C3.58 3 3 3.58 3 4.3V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Откликнуться
            </button>
          )}
        </div>

        {copyToast && (
          <div className="detail-modal__copy-toast is-visible">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8.5L7 11.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{copyText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
