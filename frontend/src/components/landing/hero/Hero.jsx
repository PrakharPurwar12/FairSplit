import { HeroLeft } from './HeroLeft';
import { Dashboard } from '../dashboard/Dashboard';

export const Hero = () => {
  return (
    <main className="pt-32 pb-16 lg:pt-36 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        <HeroLeft />
        <Dashboard />
      </div>
    </main>
  );
};
