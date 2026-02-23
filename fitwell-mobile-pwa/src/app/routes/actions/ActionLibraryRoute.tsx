import { useNavigate } from 'react-router';
import { ActionLibraryScreen } from '@/app/components/ActionLibraryScreen';
import { createNavigateHandler } from '../routeMap';

export default function ActionLibraryRoute() {
  const navigate = useNavigate();
  return (
    <ActionLibraryScreen
      onNavigate={createNavigateHandler(navigate)}
      onSelectCategory={(categoryId) => navigate(`/actions/category/${categoryId}`)}
    />
  );
}
