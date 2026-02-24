import { useNavigate } from 'react-router';
import { AuthLoginPasswordScreen } from '@/app/components/AuthLoginPasswordScreen';

export default function LoginPasswordRoute() {
  const navigate = useNavigate();
  return (
    <AuthLoginPasswordScreen
      onNavigate={(screen) => {
        if (screen === 'authRegister') navigate('/auth/register');
        if (screen === 'authLogin') navigate('/auth/login');
      }}
      onLoginSuccess={() => navigate('/home')}
    />
  );
}
