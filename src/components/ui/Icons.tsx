export interface IconProps {
    size?: number;
    className?: string;
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

/** Закрашенная звезда для рейтинга профиля */
export function StarFilledIcon({ size = 16, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5l1.85 3.74 4.15.61-3 2.93.71 4.12L8 10.67l-3.71 2.23.71-4.12-3-2.93 4.15-.61L8 1.5z"
                fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
        </svg>
    );
}

/** Иконка монеты (баланс) */
export function CoinIcon({ size = 16, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

/** Иконка скачивания резюме */
export function DownloadIcon({ size = 16, className = "" }: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8.5M8 10.5l3-3M8 10.5l-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}
