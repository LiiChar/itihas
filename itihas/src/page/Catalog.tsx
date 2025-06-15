import { HistoryElement } from '@/component/pages/History/HistoryElement';
import { LibraryAside } from '@/component/pages/Library/LibraryAside';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select';
import { getHistories } from '@/shared/api/history';
import {
	updateLibraryHistories,
	useLibraryStore,
} from '@/shared/store/LibraryStore';
import { useMount } from '@siberiacancode/reactuse';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import { useLayout } from '@/shared/hooks/useLayout';
import { ScrollTop } from '@/shared/ui/scroll-top';

export const Catalog = () => {
	const [searchParams] = useSearchParams();
	const {
		histories,
		setCountHistory,
		setOptions,
		ordering,
		setOrdering,
		setIsScrolling,
	} = useLibraryStore();
	useLayout({
		components: [{ id: 66, component: ScrollTop as any }],
		option: { always: false },
	});
	// const { ref } = useIntersectionObserver<HTMLDivElement>({
	// 	onChange() {
	// 		setCurrentPage(currentPage + 1);
	// 	},
	// });

	return (
		<main className='px-4'>
			<h1>Библиотека</h1>

			<div className='flex gap-4 my-4 flex-col-reverse md:flex-row'>
				<div className='h-full w-full md:w-3/4'>
					<div className='mb-3 flex gap-2 items-center'>
						<Select
							defaultValue='name'
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
								<SelectValue placeholder='name' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='name'>По названию</SelectItem>
								<SelectItem value='minAge'>По возврастному рейтнгу</SelectItem>
								{/* <SelectItem value='rate'>По рейтингу</SelectItem> */}
								<SelectItem value='status'>По статусу</SelectItem>
								<SelectItem value='type'>По типу</SelectItem>
								<SelectItem value='updated_at'>По обновлениям</SelectItem>
								<SelectItem value='id'>По созданию</SelectItem>
							</SelectContent>
						</Select>
						<ArrowUpDown
							className='h-5 w-5 cursor-pointer'
							onClick={() => {
								const order = ordering === 'asc' ? 'desc' : 'asc';
								setIsScrolling(false); // <--- вот это
								setOrdering(order);
							}}
						/>
					</div>
					<div className='flex h-full flex-wrap  gap-3'>
						{histories.map(h => (
							<div className='lg:w-[calc(20%-10px)] flex-grow md:w-[calc(25%-8px)] sm:w-[calc(33%-6px)] min-[320px]:w-[calc(50%-6px)] w-full h-full'>
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
				<div className='w-full md:w-1/4 top-16  md:top-20 right-0 sticky h-min'>
					<LibraryAside />
				</div>
			</div>
		</main>
	);
};
