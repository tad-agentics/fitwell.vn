import { useNavigate } from 'react-router';
import { ProfileSettingsScreen } from '@/app/components/ProfileSettingsScreen';
import { createNavigateHandler } from '../routeMap';

export default function ProfileSettingsRoute() {
  const navigate = useNavigate();
  return <ProfileSettingsScreen onNavigate={createNavigateHandler(navigate)} />;
}
