import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Sunset, Moon, Sparkles } from 'lucide-react';

const timeSlots = [
  { id: 'morning', label: 'Morning', icon: Sun, desc: '6 AM - 12 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sunset, desc: '12 PM - 6 PM' },
  { id: 'evening', label: 'Evening', icon: Moon, desc: '6 PM - 12 AM' },
  { id: 'flexible', label: 'Flexible', icon: Sparkles, desc: 'Anytime' }
];

const AvailabilityStep = ({ data, updateData }) => {
  
  const toggleTimeSlot = (id) => {
    const current = data.preferredTime || [];
    if (id === 'flexible') {
      updateData({ preferredTime: ['flexible'] });
      return;
    }

    let newTime;
    if (current.includes(id)) {
      newTime = current.filter(t => t !== id);
    } else {
      newTime = [...current.filter(t => t !== 'flexible'), id];
    }
    updateData({ preferredTime: newTime });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text mb-1">Availability</h2>
        <p className="text-sm text-text-secondary">When do you do your best work?</p>
      </div>

      <div className="flex flex-col gap-8 max-w-lg">
        
        {/* Working Hours */}
        <div className="bg-white dark:bg-surface-2 border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <h3 className="text-sm font-bold text-text">Weekly Capacity</h3>
            </div>
            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              {data.hoursPerWeek} hrs
            </span>
          </div>
          
          <div className="px-2">
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={data.hoursPerWeek}
              onChange={(e) => updateData({ hoursPerWeek: parseInt(e.target.value) })}
              className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs font-semibold text-text-muted mt-2">
              <span>10h (Part-time)</span>
              <span>40h (Full-time)</span>
              <span>60h (Overtime)</span>
            </div>
          </div>
        </div>

        {/* Preferred Working Time */}
        <div>
          <h3 className="text-sm font-bold text-text mb-3">Preferred Working Time</h3>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = data.preferredTime?.includes(slot.id);
              const Icon = slot.icon;
              
              return (
                <motion.button
                  key={slot.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'bg-white dark:bg-surface-2 border-border hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`mt-0.5 ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-text'}`}>
                      {slot.label}
                    </div>
                    <div className="text-xs font-medium text-text-secondary mt-0.5">
                      {slot.desc}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AvailabilityStep;
