import { ReactNode } from 'react';
import './ProfilePlaceholder.css';

interface ProfilePlaceholderProps {
  icon: ReactNode;
  title: string;
  hint: string;
}

export const ProfilePlaceholder = ({ icon, title, hint }: ProfilePlaceholderProps) => {
  return (
    <div className="profile-placeholder">
      {icon}
      <p className="profile-placeholder__text">{title}</p>
      <p className="profile-placeholder__hint">{hint}</p>
    </div>
  );
};
