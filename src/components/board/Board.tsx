import './Board.css';
import { useState, useMemo, useCallback } from "react";
import { IInternship, IDirection, IFilters } from '../../types';
import { useInternships } from '../../context/InternshipContext';
import { PER_PAGE } from '../../data/config';
import { getDirections, declension } from '../../utils/helpers';
import { fuzzySearch } from '../../utils/fuzzySearch';
import { useDebounce } from '../../hooks/useDebounce';
import { DirectionDropdown } from '../direction-dropdown/DirectionDropdown';
import { Toolbar } from '../toolbar/Toolbar';
import { InternshipCard } from '../internship-card/InternshipCard';

/**
 * Applies all active filters, performs fuzzy search, and sorts the internship list.
 * This is an expensive operation, so results are memoized via useMemo in the Board component.
 */
function getFilteredData(
  internships: IInternship[],
  { selectedDirections, formatFilters, employmentFilter, experienceFilters, cityFilters, companyFilters, salaryMin, salaryMax, sortBy }: IFilters,
  debouncedSearch: string
) {
  // Step 1: Apply non-search filters
  let data = internships.filter(item => {
    if (selectedDirections.length > 0) {
      const itemDirs = getDirections(item);
      const ok = selectedDirections.some((d: IDirection) => itemDirs.some((id: IDirection) => id.category === d.category && (id.subcategory === d.sub || !d.sub)));
      if (!ok) return false;
    }
    if (formatFilters.length > 0 && !formatFilters.includes(item.format)) return false;
    if (employmentFilter !== "all" && (!item.employment || item.employment !== employmentFilter)) return false;
    if (experienceFilters.length > 0 && (!item.experience || !experienceFilters.includes(item.experience))) return false;
    if (cityFilters.length > 0) {
      const itemCities: string[] = Array.isArray(item.city) ? item.city : (item.city ? [item.city] : []);
      if (!cityFilters.some((cf: string) => itemCities.includes(cf))) return false;
    }
    if (companyFilters.length > 0 && !companyFilters.includes(item.company)) return false;
    if (salaryMin && (item.salaryNum ?? 0) < salaryMin) return false;
    if (salaryMax && (item.salaryNum ?? 0) > salaryMax) return false;
    return true;
  });

  // Step 2: Apply fuzzy search on filtered results
  if (debouncedSearch) {
    data = fuzzySearch(data, debouncedSearch, 0.3);
  }

  // Step 3: Sort (only if no search, since fuzzy search returns relevance-sorted)
  if (!debouncedSearch) {
    data = [...data].sort((a, b) => {
      switch (sortBy) {
        case "deadline": return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "salary-desc": return (b.salaryNum ?? 0) - (a.salaryNum ?? 0);
        case "salary-asc": return (a.salaryNum ?? 0) - (b.salaryNum ?? 0);
        case "company": return a.company.localeCompare(b.company, "ru");
        default: return 0;
      }
    });
  }

  return data;
}

export interface BoardProps {
  onOpenDetail: (item: IInternship) => void;
  onOpenFilter: () => void;
  filters: IFilters;
  onFiltersChange: (f: IFilters) => void;
}

export const Board = ({ onOpenDetail, onOpenFilter, filters, onFiltersChange }: BoardProps) => {
  const { internships } = useInternships();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);

  const { selectedDirections, searchQuery, sortBy, formatFilters, employmentFilter, experienceFilters, cityFilters, companyFilters, salaryMin, salaryMax } = filters;

  // Debounce search query by 300ms
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filtered = useMemo(() =>
    getFilteredData(internships, filters, debouncedSearch),
    [internships, filters, debouncedSearch]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const safeStartPage = Math.min(startPage, safePage);
  const pageData = filtered.slice((safeStartPage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleResetAll = useCallback(() => {
    onFiltersChange({
      ...filters,
      sortBy: "deadline", formatFilters: [], employmentFilter: "all",
      experienceFilters: [], cityFilters: [], companyFilters: [],
      salaryMin: null, salaryMax: null,
    });
    setCurrentPage(1);
    setStartPage(1);
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((val: string) => {
    onFiltersChange({ ...filters, searchQuery: val });
    setCurrentPage(1);
    setStartPage(1);
  }, [filters, onFiltersChange]);

  const handleDirectionsChange = useCallback((dirs: IDirection[]) => {
    onFiltersChange({ ...filters, selectedDirections: dirs });
    setCurrentPage(1);
    setStartPage(1);
  }, [filters, onFiltersChange]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setStartPage(page);
    const board = document.getElementById("board");
    if (board) board.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLoadMore = () => {
    if (safePage < totalPages) {
      setCurrentPage(safePage + 1);
    }
  };

  const word = declension(filtered.length, ["стажировка", "стажировки", "стажировок"]);

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return <div className="board__pagination" id="pagination"></div>;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 1 && i <= safePage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <div className="board__pagination" id="pagination">
        <button
          className={`page-btn${safePage === 1 ? " page-btn--disabled" : ""}`}
          onClick={() => safePage > 1 && goToPage(safePage - 1)}
          aria-label="Предыдущая страница"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="page-btn page-btn--disabled">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn${p === safePage ? " page-btn--active" : ""}`}
              onClick={() => typeof p === 'number' && goToPage(p)}
              aria-label={`Страница ${p}`}
              aria-current={p === safePage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          className={`page-btn${safePage === totalPages ? " page-btn--disabled" : ""}`}
          onClick={() => safePage < totalPages && goToPage(safePage + 1)}
          aria-label="Следующая страница"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <section className="board" id="board">
      <div className="board__container">
        <DirectionDropdown
          selectedDirections={selectedDirections}
          onChange={handleDirectionsChange}
        />

        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          formatFilters={formatFilters}
          employmentFilter={employmentFilter}
          cityFilters={cityFilters}
          salaryMin={salaryMin}
          salaryMax={salaryMax}
          experienceFilters={experienceFilters}
          companyFilters={companyFilters}
          onOpenFilter={onOpenFilter}
          onResetAll={handleResetAll}
        />

        {filtered.length === 0 ? (
          <div className="board__empty" id="board-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
              <path d="M16 20C16 20 19 17 24 17C29 17 32 20 32 20" stroke="var(--Primitives--neutral--300)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="26" r="2" fill="var(--Primitives--neutral--300)" />
              <circle cx="30" cy="26" r="2" fill="var(--Primitives--neutral--300)" />
              <path d="M20 33C20 33 22 31 24 31C26 31 28 33 28 33" stroke="var(--Primitives--neutral--300)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="board__empty-text">Ничего не найдено</p>
            <p className="board__empty-hint">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <>
            <div className="board__grid" id="internships-grid">
              {pageData.map((item) => (
                <InternshipCard key={item.id} item={item} onClick={() => onOpenDetail(item)} />
              ))}
            </div>
            <div className="board__footer" id="board-footer">
              <p className="board__count" id="results-count">{filtered.length} {word}</p>
              {safePage < totalPages ? (
                <button
                  className="btn btn--outline board__load-more"
                  onClick={handleLoadMore}
                >
                  Загрузить ещё
                </button>
              ) : (
                <div className="board__load-more"></div>
              )}
              {renderPagination()}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
