import { motion } from 'framer-motion';

export const WorkflowStep = ({ data, isLast }) => {
  const Icon = data.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="relative flex flex-col items-center text-center group h-full"
    >
      {/* Connecting Line (Desktop Only) */}
      {!isLast && (
        <div className="hidden xl:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-indigo-100 to-transparent pointer-events-none z-0" />
      )}

      {/* Icon Circle */}
      <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm" />
        <Icon className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" strokeWidth={1.5} />
        
        {/* Step Number Badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          {data.step}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
        {data.title}
      </h3>
      <p className="text-[#6B7280] leading-relaxed text-sm max-w-[250px] mx-auto">
        {data.description}
      </p>
    </motion.div>
  );
};
