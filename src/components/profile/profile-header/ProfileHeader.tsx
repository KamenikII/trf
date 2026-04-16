import './ProfileHeader.css';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  university: string;
  course: string;
  direction: string;
}

export const ProfileHeader = ({ firstName, lastName, university, course, direction }: ProfileHeaderProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        {initials}
      </div>
      <div className="profile-header__info">
        <h1 className="profile-header__name">{firstName} {lastName}</h1>
        <p className="profile-header__meta">
          {university}, {course} курс, {direction}
        </p>
      </div>
    </div>
  );
};
