export const getDynamicGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      text: 'Good Morning',
      emoji: '👋',
      subtitle: 'Start your day by reviewing project health and AI insights.',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: 'Good Afternoon',
      emoji: '☀️',
      subtitle: 'Keep your team aligned and monitor ongoing progress.',
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: 'Good Evening',
      emoji: '🌇',
      subtitle: "Review today's progress and prepare for upcoming deadlines.",
    };
  } else {
    // 21:00 - 04:59
    return {
      text: 'Good Evening',
      emoji: '🌙',
      subtitle: 'Track pending work and AI recommendations before you wrap up.',
    };
  }
};
