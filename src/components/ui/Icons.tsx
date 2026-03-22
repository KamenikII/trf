export interface IconProps {
    size?: number;
    className?: string;
}

/** Иконка бургер-меню (три полоски) */
export function MenuIcon({ size = 20, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M4 8H20M4 12H20M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Иконка закрытия (×) — используется в модалках */
export function CloseIcon({ size = 20, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/** Иконка очистки поля (×) — меньшая версия */
export function ClearIcon({ size = 16, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Стрелка «назад» для многошаговых модалок */
export function BackArrowIcon({ size = 24, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Chevron (стрелка вниз) для кнопок фильтров */
export function ChevronIcon({ size = 12, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
