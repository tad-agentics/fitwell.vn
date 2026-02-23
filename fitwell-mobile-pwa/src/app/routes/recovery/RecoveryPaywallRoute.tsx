import { useNavigate } from 'react-router';
import { RecoveryProtocolPaywallScreen } from '@/app/components/RecoveryProtocolPaywallScreen';
import { createNavigateHandler } from '../routeMap';

export default function RecoveryPaywallRoute() {
  const navigate = useNavigate();
  return (
    <RecoveryProtocolPaywallScreen
      onNavigate={createNavigateHandler(navigate)}
      onViewPlans={() => navigate('/payment/pricing')}
      onSkip={() => navigate('/home')}
    />
  );
}
