import { IDirection } from '../../types';
export interface LogoUploadProps {
    photoPreview: boolean;
    photoDataUrl: string;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}

export function LogoUpload({ photoPreview, photoDataUrl, fileInputRef, onFileChange, onRemove }: LogoUploadProps) {
    return (
        <div className="post-form__group">
            <label className="post-form__label">Логотип / фотография</label>
            <div className="post-form__upload" onClick={() => !photoPreview && fileInputRef.current?.click()}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="post-form__file-input"
                    onChange={onFileChange}
                    style={photoPreview ? { display: "none" } : {}}
                />
                {!photoPreview ? (
                    <div className="post-form__upload-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Загрузить изображение</span>
                        <span className="post-form__upload-hint">PNG, JPG до 2 МБ</span>
                    </div>
                ) : (
                    <div className="post-form__upload-preview">
                        <img src={photoDataUrl} alt="preview" />
                        <button type="button" className="post-form__upload-remove" title="Удалить"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export interface DirectionSelectorProps {
    groups: {group: string; subs: string[]}[];
    selectedDirs: IDirection[];
    onToggle: (cat: string, sub: string) => void;
    error: string | undefined;
    getIcon: (cat: string, className?: string, size?: number) => React.ReactNode;
}

export function DirectionSelector({ groups, selectedDirs, onToggle, error, getIcon }: DirectionSelectorProps) {
    return (
        <div className="post-form__group">
            <label className="post-form__label">
                Направление <span className="post-form__req">*</span>
            </label>
            <div className="post-form__directions" id="post-directions">
                {groups.map(group => {
                    const cat = group.group;
                    const hasSel = selectedDirs.some(d => d.dir === cat);
                    return (
                        <div key={cat} className={`post-form__dir-group${hasSel ? " has-selection" : ""}`}>
                            <button type="button" className="post-form__dir-parent" data-dir={cat}>
                                {getIcon(cat, "post-form__dir-icon", 16)}
                                {cat}
                            </button>
                            <div className="post-form__dir-subs">
                                {group.subs.map((sub: string) => {
                                    const isActive = selectedDirs.some(d => d.dir === cat && d.sub === sub);
                                    return (
                                        <button key={sub} type="button" data-dir={cat} data-sub={sub}
                                            className={`post-form__dir-sub${isActive ? " is-active" : ""}`}
                                            onClick={() => onToggle(cat, sub)}>
                                            {sub}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {error && <p className="post-form__error">Выберите хотя бы одно направление</p>}
        </div>
    );
}

export interface GeoSelectorProps {
    geoMode: string;
    setGeoMode: (mode: string) => void;
    selectedCities: string[];
    setSelectedCities: React.Dispatch<React.SetStateAction<string[]>>;
    citySearch: string;
    setCitySearch: (val: string) => void;
    filteredCities: string[];
}

export function GeoSelector({ geoMode, setGeoMode, selectedCities, setSelectedCities, citySearch, setCitySearch, filteredCities }: GeoSelectorProps) {
    return (
        <div className="post-form__group">
            <label className="post-form__label">Геолокация</label>
            <div className="post-form__geo">
                <div className="post-form__geo-toggle">
                    <button type="button" className={`post-form__geo-option${geoMode === "all" ? " is-active" : ""}`}
                        onClick={() => { setGeoMode("all"); setSelectedCities([]); }}>
                        Вся Россия
                    </button>
                    <button type="button" className={`post-form__geo-option${geoMode === "city" ? " is-active" : ""}`}
                        onClick={() => setGeoMode("city")}>
                        Город(а)
                    </button>
                </div>
                {geoMode === "city" && (
                    <div className="post-form__geo-cities">
                        <div className="post-form__geo-search-wrap">
                            <svg className="post-form__geo-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            <input type="text" className="post-form__geo-search" placeholder="Поиск города…"
                                value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
                        </div>
                        <div className="post-form__geo-chips">
                            {filteredCities.map(c => (
                                <button key={c} type="button"
                                    className={`post-form__geo-chip${selectedCities.includes(c) ? " is-active" : ""}`}
                                    onClick={() => setSelectedCities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}>
                                    {c}
                                </button>
                            ))}
                        </div>
                        {selectedCities.length > 0 && (
                            <div className="post-form__geo-selected">
                                {selectedCities.map(c => (
                                    <span key={c} className="post-form__geo-tag">
                                        {c}
                                        <button type="button" className="post-form__geo-tag-remove" aria-label="Удалить"
                                            onClick={() => setSelectedCities(prev => prev.filter(x => x !== c))}>
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <path d="M3 3L7 7M7 3L3 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export interface ChipSelectProps {
    label: string;
    required?: boolean;
    options: string[];
    value: string;
    onChange: (val: string) => void;
    error?: string | undefined;
    errorText?: string;
}

export function ChipSelect({ label, required, options, value, onChange, error, errorText }: ChipSelectProps) {
    return (
        <div className="post-form__group">
            <label className="post-form__label">
                {label} {required && <span className="post-form__req">*</span>}
            </label>
            <div className="post-form__chips">
                {options.map(v => (
                    <button key={v} type="button"
                        className={`post-form__chip${value === v ? " is-active" : ""}`}
                        onClick={() => onChange(value === v ? "" : v)}>
                        {v}
                    </button>
                ))}
            </div>
            {error && <p className="post-form__error">{errorText}</p>}
        </div>
    );
}
