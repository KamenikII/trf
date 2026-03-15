import { useState, useRef, useCallback } from "react";

const INITIAL_FORM = {
    company: "", position: "", description: "", salary: "",
    deadline: "", contact: "",
};

export function usePostForm() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<any>({});
    const [selectedDirs, setSelectedDirs] = useState<any[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string>("");
    const [selectedEmployment, setSelectedEmployment] = useState<string>("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const [geoMode, setGeoMode] = useState("all");
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [citySearch, setCitySearch] = useState<string>("");
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = useCallback(() => {
        setForm(INITIAL_FORM);
        setErrors({});
        setSelectedDirs([]);
        setSelectedFormat("");
        setSelectedEmployment("");
        setSelectedExperience("");
        setGeoMode("all");
        setSelectedCities([]);
        setCitySearch("");
        setPhotoDataUrl(null);
        setPhotoPreview(false);
    }, []);

    const updateField = useCallback((field: string, value: string) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors((e: Record<string, string | undefined>) => ({ ...e, [field]: undefined }));
    }, []);

    const toggleSub = useCallback((dir: string, sub: string) => {
        setSelectedDirs(prev => {
            const idx = prev.findIndex(d => d.dir === dir && d.sub === sub);
            return idx >= 0 ? prev.filter((_, i) => i !== idx) : [...prev, { dir, sub }];
        });
        setErrors((e: Record<string, string | undefined>) => ({ ...e, directions: undefined }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Файл слишком большой. Максимальный размер — 2 МБ.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setPhotoDataUrl(ev.target.result as string);
                setPhotoPreview(true);
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const removePhoto = useCallback(() => {
        setPhotoDataUrl(null);
        setPhotoPreview(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const validate = useCallback(() => {
        const errs: Record<string, string> = {};
        if (!form.company.trim()) errs.company = true;
        if (!form.position.trim()) errs.position = true;
        if (selectedDirs.length === 0) errs.directions = true;
        if (!selectedFormat) errs.format = true;
        if (!selectedEmployment) errs.employment = true;
        if (!form.contact.trim()) errs.contact = true;
        return errs;
    }, [form, selectedDirs, selectedFormat, selectedEmployment]);

    const buildInternship = useCallback(() => ({
        id: `int-${Date.now()}`,
        company: form.company.trim(),
        avatar: form.company.trim().charAt(0).toUpperCase(),
        logo: photoDataUrl,
        position: form.position.trim(),
        category: selectedDirs[0]?.dir,
        subcategory: selectedDirs[0]?.sub,
        directions: selectedDirs.map(d => ({ category: d.dir, subcategory: d.sub })),
        description: form.description.trim() || null,
        city: geoMode === "all" ? ["Вся Россия"] : (selectedCities.length ? [...selectedCities] : []),
        format: selectedFormat,
        employment: selectedEmployment || null,
        salary: form.salary ? `${Number(form.salary).toLocaleString("ru-RU")} ₽` : null,
        salaryNum: form.salary ? Number(form.salary) : 0,
        deadline: form.deadline || null,
        experience: selectedExperience || null,
        contact: form.contact.trim() || null,
    }), [form, photoDataUrl, selectedDirs, geoMode, selectedCities, selectedFormat, selectedEmployment, selectedExperience]);

    return {
        form, errors, setErrors,
        selectedDirs, selectedFormat, setSelectedFormat,
        selectedEmployment, setSelectedEmployment,
        selectedExperience, setSelectedExperience,
        geoMode, setGeoMode, selectedCities, setSelectedCities,
        citySearch, setCitySearch,
        photoDataUrl, photoPreview, fileInputRef,
        resetForm, updateField, toggleSub,
        handleFileChange, removePhoto, validate, buildInternship,
    };
}
