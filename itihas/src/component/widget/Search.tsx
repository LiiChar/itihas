import { ChangeEvent, HTMLProps, memo, useEffect, useState } from 'react';
import { Loader, Search as SearchSvg } from 'lucide-react';
import { useClickOutside, useDebounceValue } from '@siberiacancode/reactuse';
import { searchByString } from '@/shared/api/common';
import { SearchResult } from '@/shared/type/common';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { Link } from 'react-router-dom';

interface Props {
	className?: HTMLProps<HTMLElement>['className'];
	action?: (search: string) => void;
}

export const Search = memo(({ className }: Props) => {
	const [search, setSearch] = useState('');
	const [values, setValues] = useState<SearchResult | null>(null);
	const debounceValue = useDebounceValue(search, 1000);
	const [loading, setLoading] = useState(false);
	const ref = useClickOutside<HTMLDivElement>(() => {
		setValues(null);
		setSearch('');
	});

	useEffect(() => {
		const controller = new AbortController();

		if (debounceValue.length > 0) {
			setLoading(true);
			searchByString(debounceValue, controller)
				.then(result => {
					setValues(result);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setValues(null);
		}

		return () => controller.abort();
	}, [debounceValue]);

	const handleInputSearch = async (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	return (
		<article
			ref={ref}
			className={`${className} relative px-2 h-9 w-full border-[1px] bg-background rounded-sm`}
		>
			<div className='flex relative items-center p-[1px] gap-2'>
				<SearchSvg width={18} height={18} />
				<Input
					className='search-book outline-none border-none z-30 py-1 px-2 h-8'
					value={search}
					placeholder='Введите название главы'
					onChange={handleInputSearch}
				/>
				{loading && (
					<Loader className='scale-90 stroke-primary animate-spin-slow spin-in spin-out-180 z-[110]' />
				)}
			</div>
			<ul
				autoFocus
				className={`${
					!values ? 'hidden' : 'border-t-0 animate-dropdawn'
				} absolute  top-8  z-100 left-0 h-auto bg-background border-[1px] -translate-x-[1px] overflow-auto box-content w-full max-h-[40vh]`}
			>
				<Separator className='' />
				{values &&
					values.history.map(history => (
						<li
							key={history.id + history.name}
							className='h-min flex justify-center li__content item-center p-1 min-h-min'
						>
							<Link
								to={`/history/${history.id}`}
								className='w-full h-full text-left'
							>
								{history.name}
							</Link>
						</li>
					))}
				{values &&
					values.page.map(page => (
						<li
							key={page.id + page.name}
							className='h-min flex justify-center li__content item-center p-1 min-h-min'
						>
							<Link
								to={`/history/read?page=${page.id}`}
								className='w-full h-full text-left'
							>
								{page.name}
							</Link>
						</li>
					))}
			</ul>
		</article>
	);
});
