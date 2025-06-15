import { getHistoriesFilter } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Slider } from '@/component/pages/Main/Slider';
import { useBreadcrumble } from '@/shared/store/BreadcrumbleStore';
import { GenresBlock } from '@/component/pages/Main/GenresBlock';
import { PageUpdate } from '@/component/pages/Main/PageUpdate';

export const Main = () => {
	const { data: newHistory } = useQuery(() =>
		getHistoriesFilter({
			orders: [
				{
					order: 'desc',
					field: 'createdAt',
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
		<div className='mt-4'>
			<div className=''>
				{newHistory && (
					<Slider histories={newHistory} link={{ src: '/library' }} />
				)}
			</div>
			<div className='md:px-10 sm:px-2 max-w-[1400px] lg:px-16 flex flex-col mt-8'>
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
		</div>
	);
};
