import { useNavigate, useParams } from 'react-router';
import { ScenarioPlaybookScreen } from '@/app/components/ScenarioPlaybookScreen';
import { useAuthStore } from '@/store/authStore';
import { useLogScenarioSession } from '@/hooks/useSupabaseQuery';

export default function ScenarioPlaybookRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const session = useAuthStore((s) => s.session);
  const logSession = useLogScenarioSession();

  if (!id) return null;

  const handleConfirm = () => {
    // Log scenario session when user confirms they've read the playbook
    if (session?.user?.id) {
      logSession.mutate({
        user_id: session.user.id,
        scenario_id: id,
      });
    }
    navigate('/home');
  };

  return (
    <ScenarioPlaybookScreen
      scenarioId={id}
      onConfirm={handleConfirm}
      onBack={() => navigate('/scenarios')}
    />
  );
}
