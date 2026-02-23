import { useNavigate, useLocation } from 'react-router';
import { AuthMagicLinkSentScreen } from '@/app/components/AuthMagicLinkSentScreen';

export default function MagicLinkSentRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';

  // If no email in state, redirect back to login
  if (!email) {
    navigate('/auth/login', { replace: true });
    return null;
  }

  return (
    <AuthMagicLinkSentScreen
      email={email}
      onNavigate={() => navigate('/auth/login')}
    />
  );
}
