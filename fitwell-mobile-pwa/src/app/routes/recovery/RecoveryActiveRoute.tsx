import { useNavigate } from 'react-router';
import { RecoveryProtocolActiveScreen } from '@/app/components/RecoveryProtocolActiveScreen';
import { useActiveRecovery } from '@/hooks/useSupabaseQuery';
import { useAuthStore } from '@/store/authStore';
import { createNavigateHandler } from '../routeMap';

export default function RecoveryActiveRoute() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const { data: recovery } = useActiveRecovery(session?.user?.id);

  return (
    <RecoveryProtocolActiveScreen
      onNavigate={createNavigateHandler(navigate)}
      onStartAction={() => navigate('/actions/flow')}
      eventType={(recovery?.event_type as any) || 'long_desk'}
    />
  );
}
