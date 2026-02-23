import { useNavigate } from 'react-router';
import { ProfileScreen } from '@/app/components/ProfileScreen';
import { createNavigateHandler } from '../routeMap';

export default function ProfileRoute() {
  const navigate = useNavigate();
  return (
    <ProfileScreen
      onBack={() => navigate(-1)}
      onNavigate={createNavigateHandler(navigate)}
    />
  );
}
