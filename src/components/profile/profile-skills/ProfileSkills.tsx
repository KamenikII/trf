import './ProfileSkills.css';

interface ProfileSkillsProps {
  skills: string[];
}

export const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  if (!skills || skills.length === 0) return null;
  
  return (
    <div className="profile-skills__card">
      <h3 className="profile-skills__title">НАВЫКИ</h3>
      <div className="profile-skills__list">
        {skills.map((skill) => (
          <span key={skill} className="profile-skills__tag">{skill}</span>
        ))}
      </div>
    </div>
  );
};
