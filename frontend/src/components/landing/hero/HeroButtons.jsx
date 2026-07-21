import { Button } from '../../ui/Button';

export const HeroButtons = ({ primaryCta, secondaryCta }) => (
  <div className="flex flex-wrap items-center gap-4 mb-8">
    <Button to={primaryCta.link} variant="primary">
      {primaryCta.text}
    </Button>
    <Button href={secondaryCta.link} variant="secondary">
      {secondaryCta.text}
    </Button>
  </div>
);
