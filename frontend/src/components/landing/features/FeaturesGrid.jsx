import React from 'react';
import { motion } from 'framer-motion';
import { mainFeaturesData } from '../../../data/featuresData';
import TaskAllocationPreview from './previews/TaskAllocationPreview';
import WorkloadOptimizationPreview from './previews/WorkloadOptimizationPreview';
import RiskPredictionPreview from './previews/RiskPredictionPreview';
import AnalyticsPreview from './previews/AnalyticsPreview';
import AIRecommendationsPreview from './previews/AIRecommendationsPreview';
import ContributionTrackingPreview from './previews/ContributionTrackingPreview';

const previews = [
  TaskAllocationPreview,
  WorkloadOptimizationPreview,
  RiskPredictionPreview,
  AnalyticsPreview,
  AIRecommendationsPreview,
  ContributionTrackingPreview
];

const FeaturesGrid = () => {
  return (
    <div className="flex flex-col gap-32 md:gap-40">
      {mainFeaturesData.map((feature, index) => {
        const PreviewComponent = previews[index];
        const isEven = index % 2 === 0;

        return (
          <div key={feature.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-6 w-full lg:max-w-[45%]"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-xl ${feature.colorClass.split(' ').slice(1).join(' ')}`}>
                <feature.icon className={`w-6 h-6 ${feature.colorClass.split(' ')[0]}`} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-text tracking-tight leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-lg text-gray-600 dark:text-text-secondary leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative line/details */}
              <div className="pt-6 border-t border-gray-200 dark:border-border flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-900 dark:text-text font-semibold text-lg">10x</span>
                  <span className="text-[10px] text-gray-500 dark:text-text-muted uppercase tracking-widest font-medium">Faster Setup</span>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-border"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-900 dark:text-text font-semibold text-lg">24/7</span>
                  <span className="text-[10px] text-gray-500 dark:text-text-muted uppercase tracking-widest font-medium">AI Monitoring</span>
                </div>
              </div>
            </motion.div>

            {/* Preview Component */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-none relative group"
            >
              {/* Decorative background accent behind the preview */}
              <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-primary-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl blur-xl -z-10`}></div>
              
              <PreviewComponent />
            </motion.div>

          </div>
        );
      })}
    </div>
  );
};

export default FeaturesGrid;
