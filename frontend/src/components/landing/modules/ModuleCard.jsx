import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const ModuleCard = ({ module }) => {
  const Icon = module.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${module.colorClass}`}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${module.tagClass}`}>
          {module.tag}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug group-hover:text-blue-600 transition-colors">
        {module.title}
      </h3>
      <p className="text-[#6B7280] leading-relaxed text-[15px] flex-1 mb-6">
        {module.description}
      </p>
      
      <div className="mt-auto pt-5 border-t border-gray-100/60">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Key Capabilities</h4>
        <ul className="space-y-2.5">
          {module.capabilities?.map((cap, idx) => (
            <li key={idx} className="flex items-center text-[13px] text-[#4B5563] font-medium leading-tight">
              <Check className="w-3.5 h-3.5 mr-2.5 text-blue-500 shrink-0" strokeWidth={3} />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};
