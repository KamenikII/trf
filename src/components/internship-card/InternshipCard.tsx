import './InternshipCard.css';
import { formatDeadline, getDirections, getCityDisplay, getCategoryClass } from '../../utils/helpers';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

function renderDirectionTags(item, maxCount) {
  const dirs = getDirections(item);
  if (dirs.length === 0) return null;
  const show = (typeof maxCount === "number" && dirs.length > maxCount) ? dirs.slice(0, maxCount) : dirs;
  const remaining = (typeof maxCount === "number" && dirs.length > maxCount) ? dirs.length - maxCount : 0;

  return (
    <>
      {show.map((d, i) => {
        const cls = getCategoryClass(d.category);
        return <span key={i} className={`tag tag--${cls}`}>{d.subcategory || d.category}</span>;
      })}
      {remaining > 0 && <span className="tag tag--neutral">+{remaining}</span>}
    </>
  );
}

export interface InternshipCardProps {
  item: IInternship;
  onClick: () => void;
}

export const InternshipCard = ({ item, onClick }: InternshipCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { currentUser } = useAuth();
  const dl = item.deadline ? formatDeadline(item.deadline) : null;
  const cityText = getCityDisplay(item, 2);
  const favorited = isFavorite(item.id);

  const canFavorite = currentUser && currentUser.role !== "company";

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <article className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card__company">
        <div className="card__avatar">
          {item.logo
            ? <img src={item.logo} alt={item.company} />
            : item.avatar
          }
        </div>
        <span className="card__company-name">{item.company}</span>
        {canFavorite && (
          <button
            className={`card__fav-btn${favorited ? " is-active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={favorited ? "Убрать из избранного" : "Добавить в избранное"}
            title={favorited ? "Убрать из избранного" : "В избранное"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 2.5h9a1 1 0 0 1 1 1v11l-5.5-3-5.5 3v-11a1 1 0 0 1 1-1z"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                fill={favorited ? "currentColor" : "none"} />
            </svg>
          </button>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{item.position}</h3>
        {item.salary && <p className="card__salary">{item.salary}</p>}
      </div>
      <div className="card__tags">
        {renderDirectionTags(item, 2)}
        {dl && (
          <span className="tag tag--neutral">
            до {dl.text}{(dl.isPast || dl.isSoon) && " 🔥"}
          </span>
        )}
        {item.format && <span className="tag tag--neutral">{item.format}</span>}
        {cityText && <span className="tag tag--neutral">{cityText}</span>}
        {item.employment && <span className="tag tag--neutral">{item.employment}</span>}
      </div>
    </article>
  );
}
