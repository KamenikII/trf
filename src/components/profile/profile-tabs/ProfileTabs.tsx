import './ProfileTabs.css';
import { DownloadIcon } from '../../ui/Icons';
import { ITab } from '../profile.types';

interface ProfileTabsProps {
  tabs: ITab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export const ProfileTabs = ({ tabs, activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <div className="profile-tabs__row">
      <div className="profile-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`profile-tabs__tab${activeTab === tab.key ? " is-active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className="profile-tabs__resume-btn">
        <DownloadIcon />
        <span>Скачать резюме</span>
      </button>
    </div>
  );
};
