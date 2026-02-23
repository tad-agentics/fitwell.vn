import { useNavigate } from 'react-router';
import { A2HSPromptScreen } from '@/app/components/A2HSPromptScreen';
import { createNavigateHandler } from '@/app/routes/routeMap';

export default function A2HSPromptRoute() {
  const navigate = useNavigate();
  return (
    <A2HSPromptScreen
      onNavigate={createNavigateHandler(navigate)}
      onComplete={() => navigate('/home')}
      onShowGuide={() => navigate('/a2hs/instructions')}
    />
  );
}
