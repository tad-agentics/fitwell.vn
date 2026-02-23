import { useNavigate } from 'react-router';
import { MondayBriefInterceptScreen } from '@/app/components/MondayBriefInterceptScreen';
import { createNavigateHandler } from '../routeMap';

export default function MondayInterceptRoute() {
  const navigate = useNavigate();
  return (
    <MondayBriefInterceptScreen
      onNavigate={createNavigateHandler(navigate)}
      onViewBrief={() => navigate('/brief')}
      onSkip={() => navigate('/checkin/morning')}
    />
  );
}
