import { getHistories, getHistoriesFilter } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Slider } from '@/component/pages/Main/Slider';
import { getCurrentDateAtMinute } from '@/shared/lib/data';

export const Main = () => {
	const { data: newHistory } = useQuery(() =>
		getHistoriesFilter({
			filter: [
				{
					field: 'updated_at',
					operator: '>',
					value: getCurrentDateAtMinute(60 * 24 * 30),
				},
			],
		})
	);
	if (!newHistory) {
		return 'Loading...';
	}

	return (
		<div>
			<Slider histories={newHistory} title='Новые истории' />
		</div>
	);
};
