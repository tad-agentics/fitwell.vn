import { useNavigate } from 'react-router';
import { CheckInFlow } from '@/app/components/CheckInFlow';

export default function CheckInRoute() {
  const navigate = useNavigate();
  return (
    <CheckInFlow
      onComplete={() => navigate('/home')}
    />
  );
}
