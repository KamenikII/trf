import './Toolbar.css';
import { sortOptions } from '../../data/config';
import { declension } from '../../utils/helpers';
import { ChevronIcon, ClearIcon } from '../ui/Icons';


export interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  formatFilters: string[];
  employmentFilter: string;
  cityFilters: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  experienceFilters: string[];
  companyFilters: string[];
  onOpenFilter: (section: string) => void;
  onResetAll: () => void;
}

export const Toolbar = ({
  searchQuery, onSearchChange,
  sortBy, formatFilters, employmentFilter, cityFilters, salaryMin, salaryMax,
  experienceFilters, companyFilters,
  onOpenFilter, onResetAll,
}: ToolbarProps) => {
  const hasActive = sortBy !== "deadline" || formatFilters.length > 0 || employmentFilter !== "all" ||
    experienceFilters.length > 0 || cityFilters.length > 0 || companyFilters.length > 0 || salaryMin || salaryMax;

  const sortLabel = sortOptions.find(o => o.value === sortBy)?.label || "По дедлайну";

  let formatLabel = "Формат";
  if (formatFilters.length === 1) formatLabel = formatFilters[0];
  else if (formatFilters.length > 1) formatLabel = `Формат: ${formatFilters.length}`;
  const emplShort = employmentFilter === "all" ? "Занятость"
    : employmentFilter === "Полная занятость" ? "Полная" : "Частичная";

  let cityLabel = "Город";
  if (cityFilters.length === 1) cityLabel = cityFilters[0];
  else if (cityFilters.length > 1) cityLabel = `${cityFilters.length} ${declension(cityFilters.length, ["город", "города", "городов"])}`;

  let salLabel = "Зарплата";
  if (salaryMin && salaryMax) salLabel = `${salaryMin / 1000}k – ${salaryMax / 1000}k ₽`;
  else if (salaryMin) salLabel = `от ${salaryMin / 1000}k ₽`;
  else if (salaryMax) salLabel = `до ${salaryMax / 1000}k ₽`;

  let modalOnlyCount = 0;
  if (experienceFilters.length > 0) modalOnlyCount++;
  if (companyFilters.length > 0) modalOnlyCount++;

  let totalActiveCount = 0;
  if (sortBy !== "deadline") totalActiveCount++;
  if (formatFilters.length > 0) totalActiveCount++;
  if (employmentFilter !== "all") totalActiveCount++;
  if (experienceFilters.length > 0) totalActiveCount++;
  if (cityFilters.length > 0) totalActiveCount++;
  if (companyFilters.length > 0) totalActiveCount++;
  if (salaryMin || salaryMax) totalActiveCount++;

  return (
    <div className="board__toolbar">
      <div className={`board__search-wrap${searchQuery ? " has-value" : ""}`}>
        <svg className="board__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="board__search"
          id="search-input"
          placeholder="Поиск…"
          style={{ paddingRight: searchQuery ? "36px" : undefined }}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="board__search-clear-btn" onClick={() => onSearchChange("")} tabIndex={-1} title="Очистить">
            <ClearIcon />
          </button>
        )}
      </div>

      <div className="board__toolbar-filters" id="toolbar-filters">
        <button
          className={`filter-btn${sortBy !== "deadline" ? " is-active" : ""}`}
          id="filter-sort"
          onClick={() => onOpenFilter("sort")}
        >
          <span className="filter-btn__label">{sortLabel}</span>
          <ChevronIcon className="filter-btn__chevron" />
        </button>

        <button
          className={`filter-btn${employmentFilter !== "all" ? " is-active" : ""}`}
          id="filter-employment"
          onClick={() => onOpenFilter("employment")}
        >
          <span className="filter-btn__label">{emplShort}</span>
          <ChevronIcon className="filter-btn__chevron" />
        </button>

        <button
          className={`filter-btn${formatFilters.length > 0 ? " is-active" : ""}`}
          id="filter-format"
          onClick={() => onOpenFilter("format")}
        >
          <span className="filter-btn__label">{formatLabel}</span>
          <ChevronIcon className="filter-btn__chevron" />
        </button>

        <button
          className={`filter-btn${cityFilters.length > 0 ? " is-active" : ""}`}
          id="filter-city"
          onClick={() => onOpenFilter("city")}
        >
          <span className="filter-btn__label">{cityLabel}</span>
          <ChevronIcon className="filter-btn__chevron" />
        </button>

        <button
          className={`filter-btn${(salaryMin || salaryMax) ? " is-active" : ""}`}
          id="filter-salary"
          onClick={() => onOpenFilter("salary")}
        >
          <span className="filter-btn__label">{salLabel}</span>
          <ChevronIcon className="filter-btn__chevron" />
        </button>

        <button
          className={`filter-btn filter-btn--all${modalOnlyCount > 0 ? " is-active" : ""}${hasActive ? " has-any-active" : ""}`}
          id="filter-all-btn"
          onClick={() => onOpenFilter("sort")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="filter-btn__label">
            Фильтры
            {modalOnlyCount > 0 && <span className="filter-btn__badge filter-btn__badge--desktop">{modalOnlyCount}</span>}
            {totalActiveCount > 0 && <span className="filter-btn__badge filter-btn__badge--mobile">{totalActiveCount}</span>}
          </span>
        </button>

        {hasActive && (
          <button className="filter-reset-btn" id="filters-reset-btn" title="Сбросить все фильтры" onClick={onResetAll}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
}
