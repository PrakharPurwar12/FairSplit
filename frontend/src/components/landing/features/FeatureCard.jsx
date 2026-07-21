import { motion } from 'framer-motion';

export const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${feature.colorClass}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
        {feature.title}
      </h3>
      <p className="text-[#6B7280] leading-relaxed text-[15px] flex-1">
        {feature.description}
      </p>
      
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/10 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};
