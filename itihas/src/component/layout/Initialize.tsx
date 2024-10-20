import { authicated } from '@/shared/api/user';
import { deleteUser } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';

const checkValideUser = async () => {
	const tokenCookie = await authicated();
	// TODO
	console.log(tokenCookie);

	if (tokenCookie) return;
	// if (tokenCookie.data) return;
	// deleteUser();
};

export const Initialize = () => {
	useMount(() => {
		checkValideUser();
	});
	return <></>;
};
