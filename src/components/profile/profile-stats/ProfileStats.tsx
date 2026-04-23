import { useCallback } from 'react';
import './ProfileStats.css';
import { StarFilledIcon, CoinIcon } from '../../ui/Icons';

interface ProfileStatsProps {
  rating: number;
  earned: number;
}

export const ProfileStats = ({ rating, earned }: ProfileStatsProps) => {
  const formatNumber = useCallback(
    (n: number): string => n.toLocaleString("ru-RU"),
    []
  );

  return (
    <div className="profile-stats">
      {/* Карточка рейтинга — градиентный фон */}
      <div className="profile-stats__card profile-stats__card--rating">
        <div className="profile-stats__card-border" aria-hidden="true" />
        <div className="profile-stats__label">
          <StarFilledIcon />
          <span>РЕЙТИНГ</span>
        </div>
        <div className="profile-stats__value profile-stats__value--light">
          {formatNumber(rating)}
        </div>
      </div>

      {/* Карточка заработка — светлая */}
      <div className="profile-stats__card profile-stats__card--fire">
        <div className="profile-stats__label">
          <CoinIcon />
          <span>ЗАРАБОТАНО</span>
        </div>
        <div className="profile-stats__value">
          {formatNumber(earned)} ₽
        </div>
      </div>
    </div>
  );
};
