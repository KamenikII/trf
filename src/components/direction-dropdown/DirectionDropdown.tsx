import './DirectionDropdown.css';
import { useState, useEffect, useRef } from "react";
import { DIRECTION_GROUPS } from '../../data/config';
import { getCategoryClass, declension } from '../../utils/helpers';
import { getDirectionIcon } from '../ui/DirectionIcons';
import { useBodyLock } from '../../hooks/useBodyLock';

const DIRECTION_LABELS = {
  IT: "IT", Дизайн: "Дизайн", Маркетинг: "Маркетинг", Финансы: "Финансы", Аналитика: "Аналитика",
};

export interface DirectionDropdownProps {
  selectedDirections: IDirection[];
  onChange: (directions: IDirection[]) => void;
}

export const DirectionDropdown = ({ selectedDirections, onChange }: DirectionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalDirs, setInternalDirs] = useState<IDirection[]>(selectedDirections);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (window.innerWidth <= 900 && dropdownRef.current) {
      const heading = dropdownRef.current;
      const h2El = heading.querySelector('.board__direction-heading') as HTMLElement | null;
      if (h2El) {
        let expectedHeight = h2El.offsetHeight;
        if (isOpen) {
          expectedHeight = Math.max(80, h2El.scrollHeight);
        }
        const isMobile = window.innerWidth <= 900;
        const offset = isMobile ? 48 : 80; // Match 48px top padding
        const varTop = offset + expectedHeight + 12;
        heading.style.setProperty('--dropdown-top', `${varTop}px`);
      }
    }
  }, [selectedDirections, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInternalDirs(selectedDirections);
    }
  }, [selectedDirections, isOpen]);

  useBodyLock(isOpen);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("direction-is-open");
      wasOpen.current = true;
    } else {
      if (wasOpen.current && window.innerWidth <= 900 && dropdownRef.current) {
        const offset = 48;
        const rect = dropdownRef.current.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY - offset;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        setTimeout(() => document.body.classList.remove("direction-is-open"), 300);
      } else {
        document.body.classList.remove("direction-is-open");
      }
      wasOpen.current = false;
    }
    return () => {
      document.body.classList.remove("direction-is-open");
    };
  }, [isOpen]);

  const handleToggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isScrolling.current) return;

    if (!isOpen) {
      const heading = dropdownRef.current;
      if (heading) {
        const isMobile = window.innerWidth <= 900;
        const offset = isMobile ? 48 : 80;
        const rect = heading.getBoundingClientRect();

        if (Math.abs(rect.top - offset) > 5) {
          const offsetTop = rect.top + window.scrollY - offset;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
          isScrolling.current = true;
          // Wait longer on mobile to ensure scroll animation reaches destination
          setTimeout(() => {
            setIsOpen(true);
            isScrolling.current = false;
          }, isMobile ? 550 : 300);
          return;
        }
      }
    }
    setIsOpen(!isOpen);
  };

  const toggleSub = (category: string, sub: string) => {
    const idx = internalDirs.findIndex(d => d.category === category && d.sub === sub);
    if (idx >= 0) {
      setInternalDirs(internalDirs.filter((_, i) => i !== idx));
    } else {
      setInternalDirs([...internalDirs, { category, sub }]);
    }
  };

  const toggleGroup = (group: {group: string; subs: string[]}) => {
    const cat = group.group;
    const subs = group.subs;
    const allSelected = subs.every((sub: string) => internalDirs.some(d => d.category === cat && d.sub === sub));
    if (allSelected) {
      setInternalDirs(internalDirs.filter(d => d.category !== cat));
    } else {
      const newDirs = [...internalDirs];
      subs.forEach((sub: string) => {
        if (!newDirs.some(d => d.category === cat && d.sub === sub)) {
          newDirs.push({ category: cat, sub });
        }
      });
      setInternalDirs(newDirs);
    }
  };

  const resetAll = () => setInternalDirs([]);

  // Compute label
  let labelText = "всех направлений";
  let selectionClass = "";
  if (internalDirs.length > 0) {
    const cats = [...new Set(internalDirs.map(d => d.category))];
    if (cats.length === 1) {
      const cat = cats[0];
      const cls = getCategoryClass(cat);
      if (cls) selectionClass = `has-selection--${cls}`;
      const group = DIRECTION_GROUPS.find(g => g.group === cat);
      const totalSubs = group ? group.subs.length : 0;
      if (internalDirs.length === 1) {
        labelText = internalDirs[0].sub;
      } else if (internalDirs.length === totalSubs) {
        labelText = (DIRECTION_LABELS as Record<string, string>)[cat] || cat;
      } else {
        labelText = `${cat} (${internalDirs.length})`;
      }
    } else {
      selectionClass = "has-selection--mixed";
      labelText = `${internalDirs.length} ${declension(internalDirs.length, ["направление", "направления", "направлений"])}`;
    }
  }

  return (
    <>
      <div className={`direction-backdrop${isOpen ? " is-open" : ""}`} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
      <div className="board__direction" ref={dropdownRef}>
        <h2
          className="board__direction-heading"
        >
          Стажировки
          <button
            className={`direction-trigger${isOpen ? " is-open" : ""}${selectionClass ? " " + selectionClass : ""}`}
            id="direction-trigger"
            onClick={handleToggleOpen}
          >
            <span id="direction-label">{labelText}</span>
            <svg className="direction-trigger__chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {internalDirs.length > 0 && (
            <button className="direction-reset" id="direction-reset" title="Сбросить направление" onClick={(e) => { e.stopPropagation(); onChange([]); setIsOpen(false); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </h2>

        <div className={`direction-dropdown-layout${isOpen ? " is-open" : ""}`}>
          <div className="direction-dropdown" id="direction-dropdown">
            <div className="direction-dropdown__header">
              <span className="direction-dropdown__title">Направления</span>
              <button className="direction-dropdown__reset" onClick={resetAll}>Сбросить</button>
            </div>

            <div className="direction-dropdown__scroll">
              <button
                className={`direction-dropdown__item${internalDirs.length === 0 ? " direction-dropdown__item--active" : ""}`}
                data-category="all"
                onClick={resetAll}
              >
                Все направления
              </button>

              {DIRECTION_GROUPS.map(group => {
                const cat = group.group;
                const count = group.subs.filter(sub => internalDirs.some(d => d.category === cat && d.sub === sub)).length;
                const allChecked = count === group.subs.length;

                return (
                  <div className="direction-dropdown__group" data-group={cat} key={cat}>
                    <button
                      className={`direction-dropdown__item direction-dropdown__item--parent${count > 0 ? " is-group-active" : ""}`}
                      data-category={cat}
                      onClick={(e) => { e.stopPropagation(); toggleGroup(group); }}
                    >
                      <span className="direction-dropdown__group-label">
                        {getDirectionIcon(cat)}
                        {cat}
                      </span>
                      <span
                        className={`direction-dropdown__group-check${allChecked ? " is-checked" : ""}`}
                        title="Выбрать всю группу"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                          {allChecked && <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
                        </svg>
                      </span>
                    </button>
                    <div className="direction-dropdown__subs">
                      {group.subs.map(sub => {
                        const isActive = internalDirs.some(d => d.category === cat && d.sub === sub);
                        return (
                          <button
                            key={sub}
                            className={`direction-dropdown__sub${isActive ? " direction-dropdown__sub--active" : ""}`}
                            data-category={cat}
                            data-sub={sub}
                            onClick={() => toggleSub(cat, sub)}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

          <div className="direction-dropdown__footer direction-dropdown__footer--desktop">
            <button className="direction-dropdown__submit" onClick={(e) => { e.stopPropagation(); onChange(internalDirs); setIsOpen(false); }}>
              Показать результаты
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only fixed bottom button — visible when dropdown is open */}
      {isOpen && (
        <div className="direction-dropdown__footer direction-dropdown__footer--mobile">
          <button className="direction-dropdown__submit" onClick={(e) => { e.stopPropagation(); onChange(internalDirs); setIsOpen(false); }}>
            Показать результаты
          </button>
        </div>
      )}
    </>
  );
}
