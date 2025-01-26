import { getHistoriesFilter } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Slider } from '@/component/pages/Main/Slider';
import { getCurrentDateAtMinute } from '@/shared/lib/data';
import { useBreadcrumble } from '@/shared/store/BreadcrumbleStore';
import { GenresBlock } from '@/component/pages/Main/GenresBlock';
import { PageUpdate } from '@/component/pages/Main/PageUpdate';

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
			orders: [
				{
					order: 'desc',
					field: 'created_at',
				},
			],
			limit: 15,
		})
	);
	const { data: popularHistory } = useQuery(() =>
		getHistoriesFilter({
			orders: [
				{
					order: 'desc',
					field: 'rate',
				},
			],
			limit: 15,
		})
	);
	useBreadcrumble('/');

	return (
		<div>
			<div className='px-3'>
				{newHistory && (
					<Slider
						histories={newHistory}
						title='Новые истории'
						link={{ src: '/library', title: 'Все новые истории' }}
					/>
				)}
			</div>
			<div className='mt-4 mx-3'>
				{popularHistory && (
					<Slider
						histories={popularHistory}
						title='Популярные истории'
						link={{ src: '/library', title: 'Все популярные истории' }}
					/>
				)}
			</div>
			<div className='my-8'>
				<GenresBlock />
			</div>
			<div>
				<PageUpdate />
			</div>
		</div>
	);
};
