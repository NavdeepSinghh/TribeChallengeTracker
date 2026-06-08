import ProfileScreenView from './profile/ProfileScreenView';
import useProfileScreenController from './profile/useProfileScreenController';

export default function ProfileScreen(props) {
  const model = useProfileScreenController(props);
  return <ProfileScreenView model={model} />;
}
