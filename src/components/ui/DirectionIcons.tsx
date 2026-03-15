import React from "react";

export interface DirectionIconProps {
  size?: number;
  className?: string;
}

export function IconIT({ size = 18, className = "" }: DirectionIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="1" y="3" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 14v3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconDesign({ size = 18, className = "" }: DirectionIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="6" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconMarketing({ size = 18, className = "" }: DirectionIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M3 14V8l5-3 5 3v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 10h2v4h-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconFinance({ size = 18, className = "" }: DirectionIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 8h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconAnalytics({ size = 18, className = "" }: DirectionIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M3 14V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 14V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 14V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<DirectionIconProps>> = {
  IT: IconIT,
  Дизайн: IconDesign,
  Маркетинг: IconMarketing,
  Финансы: IconFinance,
  Аналитика: IconAnalytics,
};

/**
 * Универсальная функция для получения иконки направления.
 * @param {string} group — название группы ("IT", "Дизайн", …)
 * @param {string} classPrefix — CSS-префикс ("direction-dropdown__group-icon" или "post-form__dir-icon")
 * @param {number} size — размер иконки
 */
export function getDirectionIcon(group: string, classPrefix = "direction-dropdown__group-icon", size = 18) {
  const Icon = ICON_MAP[group];
  if (!Icon) return null;
  const modifier = {
    IT: "it", Дизайн: "design", Маркетинг: "marketing", Финансы: "finance", Аналитика: "analytics",
  }[group] as string;
  return <Icon size={size} className={`${classPrefix} ${classPrefix}--${modifier}`} />;
}
