export const Avatar = ({ initials, colorClass = "bg-blue-100 text-blue-700" }) => (
  <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${colorClass}`}>
    {initials}
  </div>
);
