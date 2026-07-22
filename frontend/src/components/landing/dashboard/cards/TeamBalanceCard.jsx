import { AvatarGroup } from '../../../ui/AvatarGroup';
import CountUpLib from 'react-countup';
const CountUp = CountUpLib.default || CountUpLib;

export const TeamBalanceCard = ({ teamBalance }) => (
  <div className="bg-primary-brand text-white rounded-[16px] p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Team Balance</p>
      <div className="flex items-center justify-between">
        <h4 className="text-2xl lg:text-3xl font-bold text-[#7C3AED]">
          <CountUp end={teamBalance.score} duration={2} suffix="%" />
        </h4>
        <AvatarGroup members={teamBalance.members} />
      </div>
    </div>
    <p className="text-[10px] text-emerald-500 font-semibold mt-3">{teamBalance.statusText}</p>
  </div>
);
