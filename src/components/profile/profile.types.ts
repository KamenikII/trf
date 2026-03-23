export interface IProfileData {
  firstName: string;
  lastName: string;
  university: string;
  course: string;
  direction: string;
  rating: number;
  earned: number;
  skills: string[];
}

export const MOCK_PROFILE: IProfileData = {
  firstName: "Леонид",
  lastName: "Каменик",
  university: "СПбГУПТД",
  course: "2-й курс",
  direction: "Прикладная информатика в дизайне",
  rating: 12073,
  earned: 1200,
  skills: ["Figma", "React", "TypeScript", "UI/UX", "Python", "Adobe Illustrator", "HTML/CSS", "Git"],
};

export interface ITab {
  key: string;
  label: string;
}

export const TABS: ITab[] = [
  { key: "main", label: "Основная" },
  { key: "projects", label: "Проекты" },
  { key: "tasks", label: "Задания" },
  { key: "internships", label: "Стажировки" },
];
