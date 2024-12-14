import { HistoryElement } from '@/component/pages/History/HistoryElement';
import { LibraryAside } from '@/component/pages/Library/LibraryAside';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getHistories } from '@/shared/api/history';
import {
	updateLibraryHistories,
	useLibraryStore,
} from '@/shared/store/LibraryStore';
import { useMount } from '@siberiacancode/reactuse';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';

export const Catalog = () => {
	const [searchParams, _setSearchParams] = useSearchParams();
	const { histories, setCountHistory, setOptions, ordering, setOrdering } =
		useLibraryStore();
	// const { ref } = useIntersectionObserver<HTMLDivElement>({
	// 	onChange() {
	// 		setCurrentPage(currentPage + 1);
	// 	},
	// });

	useMount(() => {
		const genres = searchParams
			.get('genres')
			?.split(',')
			.map(g => ({ allow: 'true', genre: g }));
		setOptions({ genres, orders: [{ field: 'rate', order: 'desc' }] });
		getHistories()
			.then(data => setCountHistory(data.length))
			.then(() => updateLibraryHistories());
	});
	return (
		<main className='px-4'>
			<h1>Библиотека</h1>

			<div className='flex gap-4 my-4 '>
				<div className='h-full w-3/4'>
					<div className='mb-3 flex gap-2 items-center'>
						<Select
							defaultValue='rate'
							onValueChange={type => {
								setOptions({
									orders: [
										{
											field: type,
											order: ordering,
										},
									],
								});
							}}
						>
							<SelectTrigger className='w-[180px] border-[0] hover:bg-secondary text-sm h-7'>
								<SelectValue placeholder='rate' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='name'>По названию</SelectItem>
								<SelectItem value='minAge'>По возврастному рейтнгу</SelectItem>
								<SelectItem value='rate'>По рейтингу</SelectItem>
								<SelectItem value='status'>По статусу</SelectItem>
								<SelectItem value='type'>По типу</SelectItem>
								<SelectItem value='updated_at'>По обновлениям</SelectItem>
								<SelectItem value='id'>По созданию</SelectItem>
							</SelectContent>
						</Select>
						<ArrowUpDown
							className='h-5 w-5'
							onClick={() => {
								const order = ordering === 'asc' ? 'desc' : 'asc';

								setOrdering(order);
							}}
						/>
					</div>
					<div className='flex h-full flex-wrap  gap-3'>
						{histories.map(h => (
							<div className='w-[15%] h-full'>
								<HistoryElement
									option={{ nameHeight: 1, variant: 'catalog' }}
									history={h}
									link={`/history/${h.id}`}
								/>
							</div>
						))}
						{/* <div className='mt-28s' ref={ref}></div> */}
					</div>
				</div>
				<div className='w-1/4'>
					<LibraryAside />
				</div>
			</div>
		</main>
	);
};
