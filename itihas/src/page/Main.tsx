import { getHistories } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Slider } from '@/component/pages/Main/Slider';

export const Main = () => {
	const { data } = useQuery(() => getHistories());
	if (!data) {
		return 'Loading...';
	}
	return (
		<div>
			<Slider histories={data!.data} title='Все истории' />
			<Slider histories={data!.data} title='Все истории' />
			<Slider histories={data!.data} title='Все истории' />
			<Slider histories={data!.data} title='Все истории' />
			<Slider histories={data!.data} title='Все истории' />
			<Slider histories={data!.data} title='Все истории' />
		</div>
	);
};
