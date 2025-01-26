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
				loop: false,
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
			visible: history.description || history.genres.length > 0,
			content: <Description history={history} />,
		},
		{
			value: 'Персонажи',
			visible: history.characters.length > 0,
			content: <Characters history={history} />,
		},
	];
	const [activeTab, setActiveTab] = useState(
		tabs.find(el => el.visible)?.value ?? tabs[0].value
	);

	return (
		<Tabs className='has-[.tabs-triggers]:block hidden' value={activeTab}>
			<TabsList className='bg-transparent -ml-1 text-xs'>
				{tabs.map(t => (
					<>
						{t.visible && (
							<TabsTrigger
								key={t.value + 'trigger'}
								className={`rounded-none tabs-triggers relative  ${
									activeTab === t.value ? '!text-primary' : 'text-foreground'
								}`}
								value={t.value}
								onClick={() => setActiveTab(t.value)}
							>
								{t.value}
							</TabsTrigger>
						)}
					</>
				))}
			</TabsList>
			{tabs.map(t => (
				<>
					{t.visible && (
						<TabsContent
							key={t.value + 'content'}
							className='text-foreground p-0 font-normal text-sm'
							value={t.value}
						>
							{t.content}
						</TabsContent>
					)}
				</>
			))}
		</Tabs>
	);
});
