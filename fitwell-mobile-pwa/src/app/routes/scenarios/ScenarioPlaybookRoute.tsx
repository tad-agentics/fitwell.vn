import { useNavigate, useParams } from 'react-router';
import { ScenarioPlaybookScreen } from '@/app/components/ScenarioPlaybookScreen';

export default function ScenarioPlaybookRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <ScenarioPlaybookScreen
      scenarioId={id}
      onConfirm={() => navigate('/home')}
      onBack={() => navigate('/scenarios')}
    />
  );
}
