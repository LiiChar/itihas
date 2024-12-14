import { Variable } from '@/component/pages/Variable/Variable';
import { getVariable } from '@/shared/api/variable';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import type { VariableHistory as Variables } from '@/shared/type/variable';
import { useMount, useQuery } from '@siberiacancode/reactuse';
import { useParams } from 'react-router-dom';

export const VariableHistory = () => {
	const { id } = useParams();
	const { user } = useUserStore();
	if (!(id && user && 'id' in user)) {
		return '';
	}
	const { data, refetch } = useQuery<Variables[]>(() =>
		getVariable(+id, user!.id)
	);
	const { addCallback } = useListenerStore();
	useMount(() => {
		addCallback('variableUpdate', async () => {
			refetch();
		});
	});
	if (!data) {
		return '';
	}
	return <Variable variable={data} />;
};