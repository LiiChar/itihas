import { authicated } from '@/shared/api/user';
import { deleteUser, useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';

const checkValideUser = async () => {
	if (!useUserStore.getState().user) deleteUser();

	const tokenCookie = await authicated(useUserStore.getState().user!.id);
	// TODO

	// if (tokenCookie) return;
	if (tokenCookie.data) return;
	deleteUser();
};

export const Initialize = () => {
	useMount(() => {
		checkValideUser();
	});
	return <></>;
};
