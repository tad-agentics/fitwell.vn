import { useNavigate } from 'react-router';
import { AuthMagicLinkSentScreen } from '@/app/components/AuthMagicLinkSentScreen';

export default function MagicLinkSentRoute() {
  const navigate = useNavigate();
  return (
    <AuthMagicLinkSentScreen
      onNavigate={() => navigate('/auth/login')}
      onResend={() => navigate('/auth/login')}
    />
  );
}
