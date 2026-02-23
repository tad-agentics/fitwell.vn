import { useNavigate, useParams } from 'react-router';
import { ActionLibraryCategoryScreen } from '@/app/components/ActionLibraryCategoryScreen';
import { createNavigateHandler } from '../routeMap';

export default function ActionCategoryRoute() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) return null;

  return (
    <ActionLibraryCategoryScreen
      categoryId={categoryId}
      onBack={() => navigate('/actions')}
      onNavigate={createNavigateHandler(navigate)}
      onRunSequence={() => navigate('/actions/flow')}
    />
  );
}
