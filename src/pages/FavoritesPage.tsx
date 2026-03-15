import { useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useModals } from "../context/ModalContext";
import { InternshipCard } from '../components/internship-card/InternshipCard';
import { declension } from "../utils/helpers";
import { useInternships } from "../context/InternshipContext";

export const FavoritesPage = () => {
    const { internships } = useInternships();
    const { favoriteIds, clearFavorites } = useFavorites();
    const { openDetail } = useModals();

    const favoriteItems = useMemo(
        () => internships.filter(item => favoriteIds.includes(item.id)),
        [internships, favoriteIds]
    );

    return (
        <section className="board" id="favorites-board">
            <div className="board__container">
                <div className="favorites-header">
                    <h2 className="favorites-header__title">
                        Избранное
                        {favoriteItems.length > 0 && (
                            <span className="favorites-header__count">{favoriteItems.length}</span>
                        )}
                    </h2>
                    {favoriteItems.length > 0 && (
                        <button className="btn btn--ghost favorites-header__clear" onClick={clearFavorites}>
                            Очистить всё
                        </button>
                    )}
                </div>

                {favoriteItems.length === 0 ? (
                    <div className="board__empty" id="favorites-empty">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect x="12" y="6" width="24" height="36" rx="3" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
                            <path d="M18 6h12v14l-6-4-6 4V6z" stroke="var(--Primitives--neutral--300)" strokeWidth="2" fill="none" />
                        </svg>
                        <p className="board__empty-text">Нет сохранённых стажировок</p>
                        <p className="board__empty-hint">Нажмите на закладку на карточке, чтобы сохранить стажировку</p>
                    </div>
                ) : (
                    <>
                        <div className="board__grid" id="favorites-grid">
                            {favoriteItems.map(item => (
                                <InternshipCard key={item.id} item={item} onClick={() => openDetail(item)} />
                            ))}
                        </div>
                        <div className="board__footer">
                            <p className="board__count">
                                {favoriteItems.length} {declension(favoriteItems.length, ["стажировка", "стажировки", "стажировок"])}
                            </p>
                            <div></div>
                            <div></div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
