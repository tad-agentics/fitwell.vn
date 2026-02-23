import { useNavigate } from 'react-router';
import { AuthRegisterScreen } from '@/app/components/AuthRegisterScreen';

export default function RegisterRoute() {
  const navigate = useNavigate();
  return (
    <AuthRegisterScreen
      onNavigate={(screen) => {
        if (screen === 'authLogin') navigate('/auth/login');
      }}
      onRegisterSuccess={() => navigate('/onboarding')}
    />
  );
}
