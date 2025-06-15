import { authicated } from '@/shared/api/user';
import { deleteUser, useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';

const checkValideUser = async () => {
	try {
		if (!useUserStore.getState().user) deleteUser();
		if (!useUserStore.getState().user) return;
		const tokenCookie = await authicated(useUserStore.getState().user!.id);
		if (tokenCookie.status == 404) deleteUser();
	} catch (error) {
		deleteUser();
	}
};

export const Initialize = () => {
	useMount(() => {
		checkValideUser();
	});
	return <></>;
};
