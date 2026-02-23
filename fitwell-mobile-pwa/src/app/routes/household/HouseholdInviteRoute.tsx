import { useNavigate } from 'react-router';
import { HouseholdInviteScreen } from '@/app/components/HouseholdInviteScreen';
import { createNavigateHandler } from '../routeMap';

export default function HouseholdInviteRoute() {
  const navigate = useNavigate();
  return (
    <HouseholdInviteScreen
      onNavigate={createNavigateHandler(navigate)}
      onContinue={() => navigate('/onboarding')}
      onViewStatus={() => {/* handled inline */}}
    />
  );
}
