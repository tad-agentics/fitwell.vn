import { useNavigate } from 'react-router';
import { ScenarioSearchScreen } from '@/app/components/ScenarioSearchScreen';

export default function ScenarioSearchRoute() {
  const navigate = useNavigate();
  return (
    <ScenarioSearchScreen
      onSelectScenario={(id) => navigate(`/scenarios/${id}`)}
    />
  );
}
