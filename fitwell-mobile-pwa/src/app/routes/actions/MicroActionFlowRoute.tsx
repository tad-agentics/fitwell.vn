import { useNavigate } from 'react-router';
import { MicroActionFlow } from '@/app/components/MicroActionFlow';

export default function MicroActionFlowRoute() {
  const navigate = useNavigate();
  return <MicroActionFlow onComplete={() => navigate('/home')} />;
}
