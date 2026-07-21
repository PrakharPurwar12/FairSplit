import { Avatar } from './Avatar';

export const AvatarGroup = ({ members }) => (
  <div className="flex -space-x-2">
    {members.map(member => (
      <Avatar key={member.id} initials={member.initials} colorClass={member.color} />
    ))}
  </div>
);
