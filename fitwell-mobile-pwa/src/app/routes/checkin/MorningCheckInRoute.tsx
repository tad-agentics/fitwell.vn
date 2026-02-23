import { useNavigate } from 'react-router';
import { MorningCheckInFlow } from '@/app/components/MorningCheckInFlow';

export default function MorningCheckInRoute() {
  const navigate = useNavigate();
  return (
    <MorningCheckInFlow
      onComplete={() => navigate('/home')}
    />
  );
}
