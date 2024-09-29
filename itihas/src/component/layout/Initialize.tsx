import { authicated } from '@/shared/api/user';
import { getCookie } from '@/shared/lib/cookies';
import { deleteUser } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';

const checkValideUser = async () => {
	const tokenCookie = await authicated();
	// TODO
	if (tokenCookie) return;
	deleteUser();
};

export const Initialize = () => {
	useMount(() => {
		checkValideUser();
	});
	return <></>;
};
