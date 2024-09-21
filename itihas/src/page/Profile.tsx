import { useParams } from 'react-router-dom';

export const ProfilePage = () => {
	const { id } = useParams();
	return <div>Profile</div>;
};
