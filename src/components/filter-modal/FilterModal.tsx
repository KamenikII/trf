import './FilterModal.css';
import { useState, useEffect } from "react";
import { IFilters } from '../../types';
import { useInternships } from '../../context/InternshipContext';
import { modalSections, sortOptions, formatOptions, employmentOptions, experienceOptions } from '../../data/config';
import { computeAllCities, computeAllCompanies } from '../../utils/helpers';
import { CloseIcon } from '../ui/Icons';
import { FilterChipGroup, FilterMultiChipGroup, FilterSalaryRange, FilterToggleGroup } from './FilterSections';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useEscapeClose } from '../../hooks/useEscapeClose';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const FILTER_DEFAULTS = {
  sortBy: "deadline", formatFilters: [], employmentFilter: "all",
  experienceFilters: [], cityFilters: [], companyFilters: [],
  salaryMin: null, salaryMax: null,
};

export interface FilterModalProps {
  isOpen: boolean;
  initialSection: string;
  filters: IFilters;
    onApply: (f: IFilters) => void;
  onClose: () => void;
}

export const FilterModal = ({ isOpen, initialSection, filters, onApply, onClose }: FilterModalProps) => {
  const { internships } = useInternships();
  const [activeSection, setActiveSection] = useState(initialSection || "sort");
  const [temp, setTemp] = useState({ ...filters });
  const [citySearch, setCitySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const allCities = computeAllCities(internships);
  const allCompanies = computeAllCompanies(internships);

  useEffect(() => {
    if (isOpen) {
      setTemp({ ...filters });
      setActiveSection(initialSection || "sort");
      setCitySearch("");
      setCompanySearch("");
    }
  }, [isOpen, initialSection]);

  useEscapeClose(isOpen, onClose);
  useBodyLock(isOpen);
  const trapRef = useFocusTrap(isOpen);

  const getTabCount = (key) => {
    const map = {
      sort: 0,
      format: temp.formatFilters.length,
      employment: 0,
      experience: temp.experienceFilters.length,
      city: temp.cityFilters.length,
      company: temp.companyFilters.length,
      salary: (temp.salaryMin ? 1 : 0) + (temp.salaryMax ? 1 : 0),
    };
    return map[key] || 0;
  };

  const resetGroup = (group) => {
    const updates = {};
    if (group === "sort") updates.sortBy = "deadline";
    if (group === "format") updates.formatFilters = [];
    if (group === "employment") updates.employmentFilter = "all";
    if (group === "experience") updates.experienceFilters = [];
    if (group === "city") updates.cityFilters = [];
    if (group === "company") updates.companyFilters = [];
    if (group === "salary") { updates.salaryMin = null; updates.salaryMax = null; }
    setTemp(s => ({ ...s, ...updates }));
  };

  const updateTemp = (key, value) => setTemp(s => ({ ...s, [key]: value }));

  const toggleArrayItem = (stateKey, item) => {
    setTemp(s => {
      const arr = s[stateKey];
      return { ...s, [stateKey]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] };
    });
  };

  const handleApply = () => { onApply(temp); onClose(); };

  const handleResetAll = () => {
    const reset = { ...temp, ...FILTER_DEFAULTS };
    setTemp(reset);
    onApply(reset);
    onClose();
  };

  const buildChipOptions = (key, options, defaultVal = "all") =>
    options.map(o => ({
      value: typeof o === "object" ? o.value : o,
      label: typeof o === "object" ? o.label : o,
      active: temp[key + (key === "sort" ? "By" : "Filter")] === (typeof o === "object" ? o.value : o),
    }));

  const renderBody = () => {
    switch (activeSection) {
      case "sort":
        return <FilterChipGroup title="Сортировка" groupKey="sort"
          options={sortOptions.map(o => ({ ...o, active: temp.sortBy === o.value }))}
          onSelect={(v) => updateTemp("sortBy", v)}
          isNonDefault={temp.sortBy !== "deadline"} onReset={() => resetGroup("sort")} />;
      case "format":
        return <FilterToggleGroup title="Формат работы" groupKey="format"
          items={formatOptions}
          selectedItems={temp.formatFilters}
          onToggle={(f) => toggleArrayItem("formatFilters", f)}
          isNonDefault={getTabCount("format") > 0} onReset={() => resetGroup("format")}
          allLabel="Любой" />;
      case "employment":
        return <FilterChipGroup title="Тип занятости" groupKey="employment"
          options={[{ value: "all", label: "Любая", active: temp.employmentFilter === "all" }, ...employmentOptions.map(e => ({ value: e, label: e, active: temp.employmentFilter === e }))]}
          onSelect={(v) => updateTemp("employmentFilter", v)}
          isNonDefault={temp.employmentFilter !== "all"} onReset={() => resetGroup("employment")} />;
      case "experience":
        return <FilterToggleGroup title="Опыт работы" groupKey="experience"
          items={experienceOptions}
          selectedItems={temp.experienceFilters}
          onToggle={(e) => toggleArrayItem("experienceFilters", e)}
          isNonDefault={getTabCount("experience") > 0} onReset={() => resetGroup("experience")}
          allLabel="Любой" />;
      case "city":
        return <FilterMultiChipGroup title="Город" groupKey="city" items={allCities}
          selectedItems={temp.cityFilters} onToggle={(c) => toggleArrayItem("cityFilters", c)}
          search={citySearch} onSearchChange={setCitySearch}
          isNonDefault={temp.cityFilters.length > 0} onReset={() => resetGroup("city")}
          allLabel="Россия" />;
      case "company":
        return <FilterMultiChipGroup title="Компания" groupKey="company" items={allCompanies}
          selectedItems={temp.companyFilters} onToggle={(c) => toggleArrayItem("companyFilters", c)}
          search={companySearch} onSearchChange={setCompanySearch}
          isNonDefault={temp.companyFilters.length > 0} onReset={() => resetGroup("company")}
          allLabel="Все" />;
      case "salary":
        return <FilterSalaryRange salaryMin={temp.salaryMin} salaryMax={temp.salaryMax}
          onChange={(key, val) => updateTemp(key, val)}
          isNonDefault={!!(temp.salaryMin || temp.salaryMax)} onReset={() => resetGroup("salary")} />;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal is-open" id="filter-modal" role="dialog" aria-modal="true" aria-labelledby="filter-modal-title" ref={trapRef}>
      <div className="filter-modal__overlay" onClick={onClose} />
      <div className="filter-modal__panel">
        <div className="filter-modal__header">
          <h3 className="filter-modal__title" id="filter-modal-title">
            Фильтры
          </h3>
          <button className="filter-modal__close" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>
        <div className="filter-modal__layout">
          <nav className="filter-modal__nav" id="filter-modal-nav">
            {modalSections.map(s => {
              const count = getTabCount(s.key);
              const hasDot = (s.key === "sort" && temp.sortBy !== "deadline") ||
                (s.key === "employment" && temp.employmentFilter !== "all");

              return (
                <button key={s.key}
                  className={`filter-modal__nav-item${s.key === activeSection ? " is-active" : ""}`}
                  onClick={() => setActiveSection(s.key)}>
                  {s.label}
                  {count > 0 && <span className="filter-modal__nav-count">{count}</span>}
                  {hasDot && <span className="filter-modal__nav-dot" />}
                </button>
              );
            })}
          </nav>
          <div className="filter-modal__body" id="filter-modal-body">
            {renderBody()}
          </div>
        </div>
        <div className="filter-modal__footer">
          <button className="btn btn--ghost filter-modal__reset" onClick={handleResetAll}>Сбросить всё</button>
          <button className="btn btn--primary filter-modal__apply" onClick={handleApply}>Применить</button>
        </div>
      </div>
    </div>
  );
}
