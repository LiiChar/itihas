import { HistoryPages } from '../../../shared/type/history';
import { Genres } from './Genres';
import { memo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { CharacterElement } from './CharacterElement';

export const Description = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div>
			<div className='mb-5'>{history.description}</div>
			<div>
				<Genres history={history} />
			</div>
		</div>
	);
});

export const Characters = memo(({ history }: { history: HistoryPages }) => {
	return (
		<Carousel
			opts={{
				align: 'start',
				loop: true,
				dragFree: true,
			}}
			className='h-full flex gap-2 '
		>
			<CarouselContent className='h-min px-6 flex gap-2'>
				{history.characters.map(c => {
					const char: any = {
						history: history,
						...c,
					};
					return (
						<CarouselItem
							id={`${c.id}`}
							key={`${c.id}`}
							className='basis-[30%] h-min sm:basis-[20%] md:basis-[14%] lg:basis-[10%] pl-0 bg-secondary rounded-sm text-secondary-foreground'
						>
							<CharacterElement character={char} />
						</CarouselItem>
					);
				})}
			</CarouselContent>
		</Carousel>
	);
});

export const TabsInfo = memo(({ history }: { history: HistoryPages }) => {
	const tabs = [
		{
			value: 'Описание',
			content: <Description history={history} />,
		},
		{
			value: 'Персонажи',
			content: <Characters history={history} />,
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0].value);

	return (
		<Tabs value={activeTab}>
			<TabsList className='bg-transparent -ml-1 text-xs'>
				{tabs.map(t => (
					<TabsTrigger
						key={t.value}
						className={`rounded-none relative text-foreground ${
							activeTab == t.value && 'text-accent'
						}`}
						value={t.value}
						onClick={() => setActiveTab(t.value)}
					>
						{t.value}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map(t => (
				<TabsContent
					key={t.value}
					className='text-foreground p-0 font-normal text-sm'
					value={t.value}
				>
					{t.content}
				</TabsContent>
			))}
		</Tabs>
	);
});
