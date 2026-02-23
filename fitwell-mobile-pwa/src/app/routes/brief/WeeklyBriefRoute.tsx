import { useNavigate } from 'react-router';
import { WeeklyBriefScreen } from '@/app/components/WeeklyBriefScreen';
import { createNavigateHandler } from '../routeMap';

export default function WeeklyBriefRoute() {
  const navigate = useNavigate();
  return <WeeklyBriefScreen onNavigate={createNavigateHandler(navigate)} />;
}
