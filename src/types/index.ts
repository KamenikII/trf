export interface IDirection {
    category: string;
    sub?: string;
    subcategory?: string;
}

export interface ICategory {
    label: string;
    color: 'green' | 'blue' | 'purple' | 'cyan' | 'default';
}

export interface IInternship {
    id: string;
    company: string;
    avatar?: string;
    companyInitial?: string;
    logo?: string | null;
    title?: string;
    position?: string;
    salary: string;
    salaryNum?: number;
    category: any;
    subcategory?: string;
    deadline: string;
    experience?: string;
    isUrgent?: boolean;
    format: string;
    city: string | string[];
    employment?: string | null;
    description?: string;
    contact?: string;
    directions?: any[];
}

export interface IFilters {
    searchQuery: string;
    selectedDirections: IDirection[];
    formatFilters: string[];
    employmentFilter: string;
    experienceFilters: string[];
    cityFilters: string[];
    companyFilters: string[];
    salaryMin: number | null;
    salaryMax: number | null;
    sortBy: string;
}

export interface IEmployee {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
}

export interface IJoinCode {
    id: string;
    code: string;
    type: 'general' | 'personal';
    targetName?: string; // For personal codes
    createdAt: string;
}

export interface IUser {
    id: string | number;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    role: 'student' | 'company' | null;
    university?: string;
    course?: string | number;
    direction?: string;
    rating?: number;
    earned?: number;
    fire?: number;
    skills?: string[];
    avatar?: string;
    companyName?: string;
    isEducational?: boolean;
}
