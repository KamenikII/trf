import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { internships as initialInternships } from "../data/internships";
import { IInternship } from "../types";

export interface InternshipContextType {
    internships: IInternship[];
    addInternship: (internship: IInternship) => void;
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined);

export function InternshipProvider({ children }: { children: ReactNode }) {
    const [internships, setInternships] = useState<IInternship[]>(initialInternships);

    const addInternship = useCallback((internship: IInternship) => {
        setInternships(prev => [internship, ...prev]);
    }, []);

    return (
        <InternshipContext.Provider value={{ internships, addInternship }}>
            {children}
        </InternshipContext.Provider>
    );
}

export function useInternships() {
    const context = useContext(InternshipContext);
    if (context === undefined) {
        throw new Error("useInternships must be used within an InternshipProvider");
    }
    return context;
}
