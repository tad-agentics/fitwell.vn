import { useNavigate } from 'react-router';
import { PaymentSuccessScreen } from '@/app/components/PaymentSuccessScreen';
import { createNavigateHandler } from '../routeMap';

export default function PaymentSuccessRoute() {
  const navigate = useNavigate();
  return <PaymentSuccessScreen onNavigate={createNavigateHandler(navigate)} />;
}
