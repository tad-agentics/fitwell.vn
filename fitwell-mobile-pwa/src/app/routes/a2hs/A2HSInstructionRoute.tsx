import { useNavigate } from 'react-router';
import { A2HSInstructionScreen } from '@/app/components/A2HSInstructionScreen';

export default function A2HSInstructionRoute() {
  const navigate = useNavigate();
  return (
    <A2HSInstructionScreen
      onBack={() => navigate('/a2hs')}
      onComplete={() => navigate('/home')}
    />
  );
}
