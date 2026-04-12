import './PostModal.css';
import { useEffect } from "react";
import { DIRECTION_GROUPS, POST_CITY_LIST } from '../../data/config';
import { getDirectionIcon } from '../ui/DirectionIcons';
import { CloseIcon } from '../ui/Icons';
import { LogoUpload, DirectionSelector, GeoSelector, ChipSelect } from './PostFormFields';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useEscapeClose } from '../../hooks/useEscapeClose';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { usePostForm } from '../../hooks/usePostForm';
import { useAuth } from '../../context/AuthContext';

export interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (internship: IInternship) => void;
}

export const PostModal = ({ isOpen, onClose, onSubmit }: PostModalProps) => {
  const { currentUser } = useAuth();
  const f = usePostForm();

  useEffect(() => { if (isOpen) f.resetForm(); }, [isOpen]);

  useBodyLock(isOpen);
  useEscapeClose(isOpen, onClose);
  const trapRef = useFocusTrap(isOpen);

  const filteredCities = f.citySearch
    ? POST_CITY_LIST.filter(c => c.toLowerCase().includes(f.citySearch.toLowerCase()))
    : POST_CITY_LIST;

  const handleSubmit = () => {
    const errs = f.validate();
    if (Object.keys(errs).length > 0) { f.setErrors(errs); return; }
    onSubmit(f.buildInternship());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="post-modal is-open" id="post-modal" role="dialog" aria-modal="true" aria-labelledby="post-modal-title" ref={trapRef}>
      <div className="post-modal__overlay" onClick={onClose} />
      <div className="post-modal__panel">
        <div className="post-modal__header">
          <h3 className="post-modal__title">Разместить стажировку</h3>
          <button className="post-modal__close" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        <div className="post-modal__body">
          <form className="post-form" id="post-form" noValidate>
            {/* Company & Logo (only for users without organization) */}
            {!currentUser?.companyName && (
              <>
                <div className="post-form__group">
                  <label className="post-form__label" htmlFor="post-company">
                    Название компании <span className="post-form__req">*</span>
                  </label>
                  <input type="text" id="post-company" placeholder="Например: Яндекс"
                    className={`post-form__input${f.errors.company ? " is-error" : ""}`}
                    value={f.form.company}
                    onChange={(e) => f.updateField("company", e.target.value)} />
                </div>

                <LogoUpload
                  photoPreview={f.photoPreview} photoDataUrl={f.photoDataUrl || ""}
                  fileInputRef={f.fileInputRef as React.RefObject<HTMLInputElement>}
                  onFileChange={f.handleFileChange} onRemove={f.removePhoto} />
              </>
            )}

            {/* Position */}
            <div className="post-form__group">
              <label className="post-form__label" htmlFor="post-position">
                Название стажировки / позиции <span className="post-form__req">*</span>
              </label>
              <input type="text" id="post-position" placeholder="Например: Стажёр-разработчик (Backend)"
                className={`post-form__input${f.errors.position ? " is-error" : ""}`}
                value={f.form.position}
                onChange={(e) => f.updateField("position", e.target.value)} />
            </div>

            {/* Description */}
            <div className="post-form__group">
              <label className="post-form__label" htmlFor="post-description">Описание</label>
              <textarea className="post-form__textarea" id="post-description" rows={4}
                placeholder="Опишите задачи, требования и условия стажировки…"
                value={f.form.description}
                onChange={(e) => f.updateField("description", e.target.value)} />
              <p className="post-form__hint">Расскажите подробнее о стажировке, чтобы привлечь лучших кандидатов</p>
            </div>

            {/* Salary */}
            <div className="post-form__group">
              <label className="post-form__label" htmlFor="post-salary">Зарплата</label>
              <div className="post-form__salary-row">
                <input type="number" id="post-salary" placeholder="Сумма"
                  className="post-form__input post-form__input--salary"
                  value={f.form.salary}
                  onChange={(e) => f.updateField("salary", e.target.value)} />
                <span className="post-form__salary-currency">₽ / месяц</span>
              </div>
            </div>

            {/* Directions */}
            <DirectionSelector
              groups={DIRECTION_GROUPS} selectedDirs={f.selectedDirs}
              onToggle={f.toggleSub} error={f.errors.directions}
              getIcon={getDirectionIcon} />

            {/* Deadline */}
            <div className="post-form__group">
              <label className="post-form__label" htmlFor="post-deadline">Дедлайн подачи</label>
              <input type="date" className="post-form__input" id="post-deadline"
                value={f.form.deadline}
                onChange={(e) => f.updateField("deadline", e.target.value)} />
            </div>

            {/* Geo */}
            <GeoSelector
              geoMode={f.geoMode} setGeoMode={f.setGeoMode}
              selectedCities={f.selectedCities} setSelectedCities={f.setSelectedCities}
              citySearch={f.citySearch} setCitySearch={f.setCitySearch}
              filteredCities={filteredCities} />

            {/* Format */}
            <ChipSelect label="Формат работы" required options={["Удалённо", "Офис", "Гибрид"]}
              value={f.selectedFormat}
              onChange={(v) => { f.setSelectedFormat(v); f.setErrors((e: any) => ({ ...e, format: undefined })); }}
              error={f.errors.format} errorText="Выберите формат работы" />

            {/* Employment */}
            <ChipSelect label="Занятость" required options={["Полная занятость", "Частичная занятость"]}
              value={f.selectedEmployment}
              onChange={(v) => { f.setSelectedEmployment(v); f.setErrors((e: any) => ({ ...e, employment: undefined })); }}
              error={f.errors.employment} errorText="Выберите тип занятости" />

            {/* Experience */}
            <ChipSelect label="Требуемый опыт" options={["Без опыта", "До 1 года", "1-3 года"]}
              value={f.selectedExperience}
              onChange={(v) => f.setSelectedExperience(v)} />

            {/* Contact */}
            <div className="post-form__group">
              <label className="post-form__label" htmlFor="post-contact">
                Контакт для связи <span className="post-form__req">*</span>
              </label>
              <input type="text" id="post-contact" placeholder="Ссылка или email для студентов"
                className={`post-form__input${f.errors.contact ? " is-error" : ""}`}
                value={f.form.contact}
                onChange={(e) => f.updateField("contact", e.target.value)} />
              {f.errors.contact && <p className="post-form__error">Укажите контакт для связи</p>}
              <p className="post-form__hint">Укажите ссылку на форму заявки или email для связи</p>
            </div>
          </form>
        </div>

        <div className="post-modal__footer">
          <button className="btn btn--ghost post-modal__cancel" onClick={onClose}>Отмена</button>
          <button className="btn btn--primary post-modal__submit" onClick={handleSubmit}>Опубликовать</button>
        </div>
      </div>
    </div>
  );
}
