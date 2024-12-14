import { getHistoriesFilter } from '@/shared/api/history';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { HistoryAll } from '@/shared/type/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useMount } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';

export const GenresBlock = () => {
	const tabs = [
		'Романтика',
		'Боевые искусства',
		'Детектив',
		'Хоррор',
		'Приключения',
	] as const;
	let [casheHistoryTabs, setCasheHistoryTabs] = useState<
		Record<(typeof tabs)[number], HistoryAll[]>
	>({
		'Боевые искусства': [],
		Детектив: [],
		Приключения: [],
		Романтика: [],
		Хоррор: [],
	});

	const [history, setHistory] = useState<HistoryAll[]>([]);
	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

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
			setCasheHistoryTabs(
				data.reduce((acc, h, i) => {
					acc[tabs[i]] = h;
				}, {} as any)
			);
		});
		console.log(casheHistoryTabs);

		setHistory(casheHistoryTabs[tabs[0]]);
	});

	useEffect(() => {
		console.log(casheHistoryTabs, activeTab);
		const hisotry = casheHistoryTabs[activeTab];

		setHistory(hisotry);
	}, [activeTab]);

	return (
		<Tabs value={activeTab} className=''>
			<TabsList className='bg-transparent w-full overflow-x-auto overflow-y-hidden -ml-1 text-xs '>
				{tabs.map(t => (
					<TabsTrigger
						key={t}
						className={`rounded-none relative text-foreground ${
							activeTab == t && 'text-accent'
						}`}
						value={t}
						onClick={() => setActiveTab(t)}
					>
						{t}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map(t => (
				<TabsContent
					key={t}
					className='text-foreground  p-0 px-4 font-normal text-sm  flex gap-2 flex-wrap flex-row'
					value={t}
				>
					{history.length == 0 && <div>Пусто как в тумане</div>}
					{history.map(history => (
						<div className='w-[calc(20%-6px)] max-w-[120px] relative'>
							<img
								src={getFullUrl(history.image)}
								onError={handleImageError}
								loading='lazy'
								className='object-cover rounded-t-sm w-full aspect-[3/4]'
								alt={history.name}
							/>
							<div className='px-1 overflow-hidden pb-1 pt-1 text-[60%] sm:text-[10px] md:text-[12px] lg:text-[14px]'>
								<div className='flex gap-2 text-muted-foreground text-[0.8em]'>
									<div>
										{history.genres.length > 0 && history.genres[0].genre.name}
									</div>
									<div className='bg-primary flex justify-center items-center w-[16px] h-[14px] rounded-sm absolute top-1 text-white text-xs pb-[4px] right-1'>
										{history.rate}
									</div>
								</div>
								<div>{history.name}</div>
							</div>
						</div>
					))}
				</TabsContent>
			))}
		</Tabs>
	);
};
