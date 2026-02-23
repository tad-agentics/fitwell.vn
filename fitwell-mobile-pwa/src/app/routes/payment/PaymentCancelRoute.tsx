import { useNavigate } from 'react-router';
import { PaymentCancelScreen } from '@/app/components/PaymentCancelScreen';
import { createNavigateHandler } from '../routeMap';

export default function PaymentCancelRoute() {
  const navigate = useNavigate();
  return <PaymentCancelScreen onNavigate={createNavigateHandler(navigate)} />;
}
