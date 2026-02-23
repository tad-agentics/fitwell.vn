import { useNavigate } from 'react-router';
import { AuthLoginMagicLinkScreen } from '@/app/components/AuthLoginMagicLinkScreen';

export default function LoginRoute() {
  const navigate = useNavigate();
  return (
    <AuthLoginMagicLinkScreen
      onNavigate={(screen) => {
        if (screen === 'authRegister') navigate('/auth/register');
      }}
      onSubmit={() => navigate('/auth/magic-link-sent')}
    />
  );
}
