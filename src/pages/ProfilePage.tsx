import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { IProfileData, MOCK_PROFILE, TABS } from "../components/profile/profile.types";
import { ProfileHeader } from "../components/profile/profile-header/ProfileHeader";
import { ProfileTabs } from "../components/profile/profile-tabs/ProfileTabs";
import { ProfileStats } from "../components/profile/profile-stats/ProfileStats";
import { ProfileSkills } from "../components/profile/profile-skills/ProfileSkills";
import { ProfilePlaceholder } from "../components/profile/profile-placeholder/ProfilePlaceholder";

/* ── SVG-иконки для плейсхолдеров (inline, уникальные для каждой вкладки) ── */

const ProjectsPlaceholderIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="10" width="36" height="28" rx="3" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
    <path d="M6 18h36" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
    <circle cx="12" cy="14" r="1.5" fill="var(--Primitives--neutral--300)" />
    <circle cx="17" cy="14" r="1.5" fill="var(--Primitives--neutral--300)" />
    <circle cx="22" cy="14" r="1.5" fill="var(--Primitives--neutral--300)" />
  </svg>
);

const TasksPlaceholderIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="10" y="6" width="28" height="36" rx="3" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
    <path d="M17 18h14M17 24h14M17 30h8" stroke="var(--Primitives--neutral--300)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const InternshipsPlaceholderIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="24" rx="3" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
    <path d="M18 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
    <path d="M8 22h32" stroke="var(--Primitives--neutral--300)" strokeWidth="2" />
  </svg>
);

/* ── Компонент-оркестратор страницы профиля ── */

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("main");

  // Берём данные из currentUser или используем мок
  const profile: IProfileData = {
    firstName: currentUser?.firstName || MOCK_PROFILE.firstName,
    lastName: currentUser?.lastName || MOCK_PROFILE.lastName,
    university: currentUser?.university || MOCK_PROFILE.university,
    course: currentUser?.course || MOCK_PROFILE.course,
    direction: currentUser?.direction || MOCK_PROFILE.direction,
    rating: currentUser?.rating || MOCK_PROFILE.rating,
    earned: currentUser?.earned || MOCK_PROFILE.earned,
    skills: currentUser?.skills || MOCK_PROFILE.skills,
  };

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  return (
    <section className="profile-page" id="profile-page">
      <div className="profile-page__container">
        <ProfileHeader
          firstName={profile.firstName}
          lastName={profile.lastName}
          university={profile.university}
          course={profile.course}
          direction={profile.direction}
        />

        <ProfileTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="profile-page__content" role="tabpanel">
          {activeTab === "main" && (
            <>
              <ProfileStats rating={profile.rating} earned={profile.earned} />
              <ProfileSkills skills={profile.skills} />
            </>
          )}

          {activeTab === "projects" && (
            <ProfilePlaceholder
              icon={ProjectsPlaceholderIcon}
              title="Проекты скоро появятся"
              hint="Здесь будут отображаться ваши проекты"
            />
          )}

          {activeTab === "tasks" && (
            <ProfilePlaceholder
              icon={TasksPlaceholderIcon}
              title="Заданий пока нет"
              hint="Здесь будут отображаться ваши задания"
            />
          )}

          {activeTab === "internships" && (
            <ProfilePlaceholder
              icon={InternshipsPlaceholderIcon}
              title="Стажировки скоро появятся"
              hint="Здесь будут отображаться ваши стажировки"
            />
          )}
        </div>
      </div>
    </section>
  );
};
