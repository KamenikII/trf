import { useState, useRef } from "react";
import { ClearIcon } from '../ui/Icons';

export interface FilterChipGroupProps {
    title: string;
    groupKey: string;
    options: {value: string; label: string}[];
    onSelect: (value: string) => void;
    isNonDefault: boolean;
    onReset: () => void;
}

export function FilterChipGroup({ title, groupKey, options, onSelect, isNonDefault, onReset }: FilterChipGroupProps) {
    return (
        <div className="modal-filter-group" data-group={groupKey}>
            <div className="modal-filter-group__header">
                <span className="modal-filter-group__title">{title}</span>
                {isNonDefault && (
                    <button className="modal-filter-group__reset is-visible" onClick={onReset}>Сбросить</button>
                )}
            </div>
            <div className="modal-filter-options">
                {options.map(o => (
                    <button key={o.value}
                        className={`modal-filter-chip${o.active ? " is-active" : ""}`}
                        onClick={() => onSelect(o.value)}>
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export interface FilterMultiChipGroupProps {
    title: string;
    groupKey: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    search: string;
    onSearchChange: (search: string) => void;
    isNonDefault: boolean;
    onReset: () => void;
    allLabel?: string;
}

export function FilterMultiChipGroup({ title, groupKey, items, selectedItems, onToggle, search, onSearchChange, isNonDefault, onReset, allLabel }: FilterMultiChipGroupProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filtered = search
        ? items.filter(c => c.toLowerCase().includes(search.toLowerCase()))
        : items;

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
    };

    const handleBlur = () => {
        if (!search) {
            setIsExpanded(false);
        }
    };

    const isEffectivelyExpanded = isExpanded || search.length > 0;

    return (
        <div className="modal-filter-group" data-group={groupKey}>
            <div className="modal-filter-group__header">
                <span className="modal-filter-group__title">{title}</span>
                {isNonDefault && (
                    <button className="modal-filter-group__reset is-visible" onClick={onReset}>Сбросить</button>
                )}
            </div>
            <div className="modal-filter-options">
                <div className={`modal-city-search-wrap ${isEffectivelyExpanded ? "is-expanded" : "is-collapsed"}`}>
                    <input type="text" className="modal-city-search"
                        ref={searchInputRef}
                        placeholder={`Поиск ${groupKey === "city" ? "города" : "компании"}…`}
                        value={search} onChange={(e) => onSearchChange(e.target.value)}
                        onBlur={handleBlur}
                        onClick={!isEffectivelyExpanded ? handleExpand : undefined}
                        readOnly={!isEffectivelyExpanded} />

                    {!isEffectivelyExpanded && (
                        <button type="button" className="modal-city-search-toggle" onClick={handleExpand} tabIndex={-1}>
                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ transform: "rotate(15deg)" }}>
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}

                    {isEffectivelyExpanded && search && (
                        <button type="button" className="modal-city-search-clear"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onSearchChange(""); searchInputRef.current?.focus(); }}
                            tabIndex={-1} title="Очистить">
                            <ClearIcon />
                        </button>
                    )}
                </div>
                {allLabel && (
                    <button key="all"
                        className={`modal-filter-chip${selectedItems.length === 0 ? " is-active" : ""}`}
                        onClick={selectedItems.length !== 0 ? onReset : undefined}>
                        {allLabel}
                    </button>
                )}
                {filtered.map(c => (
                    <button key={c}
                        className={`modal-filter-chip${selectedItems.includes(c) ? " is-active" : ""}`}
                        onClick={() => onToggle(c)}>
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}

export interface FilterToggleGroupProps {
    title: string;
    groupKey: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    isNonDefault: boolean;
    onReset: () => void;
    allLabel?: string;
}

export function FilterToggleGroup({ title, groupKey, items, selectedItems, onToggle, isNonDefault, onReset, allLabel }: FilterToggleGroupProps) {
    return (
        <div className="modal-filter-group" data-group={groupKey}>
            <div className="modal-filter-group__header">
                <span className="modal-filter-group__title">{title}</span>
                {isNonDefault && (
                    <button className="modal-filter-group__reset is-visible" onClick={onReset}>Сбросить</button>
                )}
            </div>
            <div className="modal-filter-options">
                {allLabel && (
                    <button key="all"
                        className={`modal-filter-chip${selectedItems.length === 0 ? " is-active" : ""}`}
                        onClick={selectedItems.length !== 0 ? onReset : undefined}>
                        {allLabel}
                    </button>
                )}
                {items.map(o => {
                    const val = typeof o === "object" ? o.value : o;
                    const label = typeof o === "object" ? o.label : o;
                    return (
                        <button key={val}
                            className={`modal-filter-chip${selectedItems.includes(val) ? " is-active" : ""}`}
                            onClick={() => onToggle(val)}>
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export interface FilterSalaryRangeProps {
    salaryMin: number | null;
    salaryMax: number | null;
    onChange: (key: string, val: number | null) => void;
    isNonDefault: boolean;
    onReset: () => void;
}

export function FilterSalaryRange({ salaryMin, salaryMax, onChange, isNonDefault, onReset }: FilterSalaryRangeProps) {
    return (
        <div className="modal-filter-group" data-group="salary">
            <div className="modal-filter-group__header">
                <span className="modal-filter-group__title">Зарплата</span>
                {isNonDefault && (
                    <button className="modal-filter-group__reset is-visible" onClick={onReset}>Сбросить</button>
                )}
            </div>
            <div className="modal-salary-range">
                <input type="number" className="modal-salary-input" placeholder="от"
                    value={salaryMin || ""}
                    onChange={(e) => onChange("salaryMin", e.target.value ? parseInt(e.target.value) : null)} />
                <span className="modal-salary-sep">—</span>
                <input type="number" className="modal-salary-input" placeholder="до"
                    value={salaryMax || ""}
                    onChange={(e) => onChange("salaryMax", e.target.value ? parseInt(e.target.value) : null)} />
                <span className="modal-salary-sep">₽</span>
            </div>
        </div>
    );
}
