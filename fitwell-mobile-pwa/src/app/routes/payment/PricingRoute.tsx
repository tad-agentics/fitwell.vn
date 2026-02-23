import { useNavigate } from 'react-router';
import { PricingScreen } from '@/app/components/PricingScreen';
import { useSubscription } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';
import { createNavigateHandler } from '../routeMap';

export default function PricingRoute() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const { data: subscription } = useSubscription(session?.user?.id);

  return (
    <PricingScreen
      onNavigate={createNavigateHandler(navigate)}
      onSelectPlan={() => navigate('/payment/success')}
      currentPlan={subscription?.status === 'active' ? subscription.plan : 'free'}
    />
  );
}
