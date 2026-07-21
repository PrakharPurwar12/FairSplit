import { motion } from 'framer-motion';

export const SectionHeader = ({ badge, title, description }) => {
  return (
    <div className="max-w-2xl mx-auto text-center mb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest shadow-sm">
          {badge}
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  );
};
