import { useNavigate } from 'react-router';
import { ContextSelectorScreen } from '@/app/components/ContextSelectorScreen';

export default function ContextSelectorRoute() {
  const navigate = useNavigate();
  return (
    <ContextSelectorScreen
      onSelect={() => navigate('/actions/flow')}
      onBack={() => navigate(-1)}
    />
  );
}
