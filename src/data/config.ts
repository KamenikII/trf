export const categoryColorClass = {
  IT: "it",
  Дизайн: "design",
  Маркетинг: "marketing",
  Финансы: "finance",
  Аналитика: "analytics",
};

export const sortOptions = [
  { value: "deadline", label: "По дедлайну" },
  { value: "salary-desc", label: "Зарплата ↓" },
  { value: "salary-asc", label: "Зарплата ↑" },
  { value: "company", label: "По компании" },
];

export const formatOptions = ["Удалённо", "Офис", "Гибрид"];
export const employmentOptions = ["Полная занятость", "Частичная занятость"];
export const experienceOptions = ["Без опыта", "До 1 года", "1-3 года"];

export const modalSections = [
  { key: "sort", label: "Сортировка" },
  { key: "employment", label: "Занятость" },
  { key: "format", label: "Формат" },
  { key: "city", label: "Город" },
  { key: "experience", label: "Опыт" },
  { key: "company", label: "Компания" },
  { key: "salary", label: "Зарплата" },
];

export const POST_CITY_LIST = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Самара", "Челябинск", "Ростов-на-Дону", "Уфа",
  "Красноярск", "Воронеж", "Пермь", "Волгоград", "Краснодар",
  "Тюмень", "Саратов", "Тольятти", "Ижевск", "Барнаул",
  "Иркутск", "Хабаровск", "Ярославль", "Владивосток", "Томск",
  "Оренбург", "Кемерово", "Рязань", "Калининград", "Сочи",
];

export const DIRECTION_GROUPS = [
  {
    group: "IT",
    icon: "it",
    subs: ["Frontend", "Backend", "Mobile", "QA", "DevOps", "Кибербезопасность"],
  },
  {
    group: "Дизайн",
    icon: "design",
    subs: ["UX/UI", "Графический дизайн", "Motion-дизайн", "UX Research"],
  },
  {
    group: "Маркетинг",
    icon: "marketing",
    subs: ["SMM", "Контент", "Бренд"],
  },
  {
    group: "Финансы",
    icon: "finance",
    subs: ["Финансовый анализ", "Контроллинг"],
  },
  {
    group: "Аналитика",
    icon: "analytics",
    subs: ["Data Analysis", "ML", "Продуктовая", "Бизнес-аналитика"],
  },
];

export const PER_PAGE = 9;
