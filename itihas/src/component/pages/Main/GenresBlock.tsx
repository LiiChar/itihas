import { getHistoriesFilter } from '@/shared/api/history';
import { HistoryAll } from '@/shared/type/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useMount } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';
import { HistoryElement } from '../History/HistoryElement';

export const GenresBlock = () => {
	const tabs = [
		'Романтика',
		'Боевые искусства',
		'Детектив',
		'Хоррор',
		'Приключения',
	] as const;
	const [casheHistoryTabs, setCasheHistoryTabs] = useState<
		Record<(typeof tabs)[number], HistoryAll[]>
	>({
		'Боевые искусства': [],
		Детектив: [],
		Приключения: [],
		Романтика: [],
		Хоррор: [],
	});

	const [history, setHistory] = useState<HistoryAll[]>([]);

	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(
		(Object.entries(casheHistoryTabs).find(
			([_k, t]) => t && t.length > 0
		)?.[0] ?? 'Романтика') as (typeof tabs)[number]
	);

	useMount(() => {
		const promises: Promise<HistoryAll[]>[] = [];
		tabs.forEach(t => {
			const prom = getHistoriesFilter({
				orders: [
					{
						order: 'desc',
						field: 'rate',
					},
				],
				genres: [
					{
						allow: 'true',
						genre: t,
					},
				],
				limit: 10,
			});

			promises.push(prom);
		});
		Promise.all(promises).then(data => {
			const histories: any = data.reduce((acc, h, i) => {
				if (h.length > 0) {
					acc[tabs[i]] = h;
					h.reduce<string[]>((acc, el) => {
						const genre = el.genres.find(g =>
							tabs.includes(g.genre.name as any)
						);
						if (genre) {
							acc.push(genre.genre.name);
						}
						return acc;
					}, []);
				}
				return acc;
			}, {} as any);
			setCasheHistoryTabs(histories);
			setActiveTab(Object.keys(histories)[0] as any);
			setHistory(histories[activeTab]);
		});
	});

	useEffect(() => {
		const hisotry = casheHistoryTabs[activeTab];

		setHistory(hisotry);
	}, [activeTab]);

	return (
		<Tabs value={activeTab} className='w-full'>
			<TabsList className='bg-transparent flex gap-3 flex-wrap w-full overflow-x-auto overflow-y-hidden text-md '>
				{tabs &&
					tabs.map((t, i) => (
						<>
							{casheHistoryTabs[t] && casheHistoryTabs[t].length ? (
								<TabsTrigger
									key={'header' + t + i}
									className={`rounded-none relative px-0 block text-foreground ${
										activeTab == t && 'text-accent'
									}`}
									value={t}
									onClick={() => setActiveTab(t)}
								>
									{t}
								</TabsTrigger>
							) : (
								''
							)}
						</>
					))}
			</TabsList>
			{tabs &&
				tabs.map((t, i) => (
					<TabsContent
						key={'content' + t + i}
						className='empty:hidden text-foreground  p-0 px-4 font-normal text-sm  flex gap-2 flex-wrap flex-row'
						value={t}
					>
						{history && history.length == 0 && <div>Пусто как в тумане</div>}
						{history &&
							history.map(history => (
								<HistoryElement
									history={history}
									variant='inner'
									link={`/history/${history.id}`}
									className='block w-[calc(20%-6px)] max-w-[120px] relative aspect-[9/14] cursor-pointer hover:scale-105 transition-all'
								/>
								// <Link
								// 	to={`/history/${history.id}`}
								// 	className='block w-[calc(20%-6px)] max-w-[120px] relative'
								// >
								// 	<img
								// 		src={getFullUrl(history.image)}
								// 		onError={handleImageError}
								// 		loading='lazy'
								// 		className='object-cover rounded-t-sm w-full aspect-[3/4]'
								// 		alt={history.name}
								// 	/>
								// 	<div className='	 overflow-hidden pb-1 pt-1 text-md sm:text-sm md:text-md lg:text-lg'>
								// 		<p className='h-min text-muted-foreground text-[0.7em] leading-3'>
								// 			{history.genres &&
								// 				history.genres.length > 0 &&
								// 				history.genres[0].genre.name}
								// 		</p>
								// 		<p className='text-sm'>{history.name}</p>
								// 	</div>
								// 	<div className='bg-primary flex justify-center items-center w-min px-1 h-[20px] rounded-lg absolute top-1 text-white text-xs right-1'>
								// 		<span className='h-min w-min '>
								// 			{history.like ?? history.rate}
								// 		</span>
								// 	</div>
								// </Link>
							))}
					</TabsContent>
				))}
		</Tabs>
	);
};
