import { useNavigate } from 'react-router';
import { OnboardingScreen } from '@/app/components/OnboardingScreen';

export default function OnboardingRoute() {
  const navigate = useNavigate();
  return (
    <OnboardingScreen
      onComplete={() => navigate('/a2hs')}
    />
  );
}
