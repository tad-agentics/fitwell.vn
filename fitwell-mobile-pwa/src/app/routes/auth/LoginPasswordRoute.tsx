import { useNavigate } from 'react-router';
import { AuthLoginMagicLinkScreen } from '@/app/components/AuthLoginMagicLinkScreen';

export default function LoginMagicLinkRoute() {
  const navigate = useNavigate();
  return (
    <AuthLoginMagicLinkScreen
      onNavigate={(screen) => {
        if (screen === 'authRegister') navigate('/auth/register');
        if (screen === 'authLoginPassword') navigate('/auth/login');
      }}
      onSubmit={(email) => navigate('/auth/magic-link-sent', { state: { email } })}
    />
  );
}
