import { useNavigate } from 'react-router';
import { PostEventCheckInFlow } from '@/app/components/PostEventCheckInFlow';

export default function PostEventCheckInRoute() {
  const navigate = useNavigate();
  return (
    <PostEventCheckInFlow
      onComplete={() => navigate('/home')}
    />
  );
}
