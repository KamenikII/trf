import { createContext, useContext, useState, useCallback, ReactNode } from "react";

import { IFilters } from "../types";

const DEFAULT_FILTERS: IFilters = {
    selectedDirections: [],
    searchQuery: "",
    sortBy: "deadline",
    formatFilters: [],
    employmentFilter: "all",
    experienceFilters: [],
    cityFilters: [],
    companyFilters: [],
    salaryMin: null,
    salaryMax: null,
};

export interface FilterContextType {
    filters: IFilters;
    setFilters: React.Dispatch<React.SetStateAction<IFilters>>;
    updateFilters: (updates: Partial<IFilters>) => void;
    resetFilters: () => void;
    resetAll: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<IFilters>(DEFAULT_FILTERS);

    const updateFilters = useCallback((updates: Partial<IFilters>) => {
        setFilters(prev => ({ ...prev, ...updates }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            sortBy: "deadline",
            formatFilters: [],
            employmentFilter: "all",
            experienceFilters: [],
            cityFilters: [],
            companyFilters: [],
            salaryMin: null,
            salaryMax: null,
        }));
    }, []);

    const resetAll = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return (
        <FilterContext.Provider value={{ filters, setFilters, updateFilters, resetFilters, resetAll }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error("useFilters must be used within FilterProvider");
    return ctx;
}

export { DEFAULT_FILTERS };
