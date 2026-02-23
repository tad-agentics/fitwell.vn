import { useNavigate } from 'react-router';
import { PreSleepWindDownScreen } from '@/app/components/PreSleepWindDownScreen';

export default function PreSleepRoute() {
  const navigate = useNavigate();
  return (
    <PreSleepWindDownScreen
      onReady={() => navigate('/home')}
      onDelay={() => navigate('/home')}
    />
  );
}
