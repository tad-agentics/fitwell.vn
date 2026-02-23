import { useNavigate } from 'react-router';
import { HouseholdPartnerHomeScreen } from '@/app/components/HouseholdPartnerHomeScreen';
import { createNavigateHandler } from '../routeMap';

export default function HouseholdHomeRoute() {
  const navigate = useNavigate();
  return <HouseholdPartnerHomeScreen onNavigate={createNavigateHandler(navigate)} />;
}
