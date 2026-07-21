import { Badge } from '../../ui/Badge';
import { featuresData } from '../../../data/featuresData';

export const FeatureBadges = () => (
  <div className="flex flex-wrap gap-3 max-w-lg">
    {featuresData.map((feature) => {
      const Icon = feature.icon;
      return (
        <Badge key={feature.id} className={feature.colorClass}>
          <Icon size={12} strokeWidth={3} /> {feature.label}
        </Badge>
      );
    })}
  </div>
);
