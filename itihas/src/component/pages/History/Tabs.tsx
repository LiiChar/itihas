import { HistoryPages } from '../../../shared/type/history';
import { Genres } from './Genres';
import { memo, useId, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Similar } from './Similar';
import { CharacterElement } from '@/component/widget/character/CharacterElement';
import { CharacterFormModal } from '@/component/widget/character/CharacterFormModal';
import { Plus } from 'lucide-react';
import { runListener } from '@/shared/store/ListenerStore';
import { getComponent } from '@/page/History/CreateHistory';
import { useUserStore } from '@/shared/store/UserStore';
import Markdown from 'react-markdown';

export const Description = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div>
			<div className='mb-5  overflow-hidden markdown'>
				<Markdown>{history.description}</Markdown>
			</div>
			<div>
				<Genres history={history} />
			</div>
		</div>
	);
});

export const LayoutTab = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div
			className={`gap-3 w-1/3 flex flex-col border-2 hover:border-2 hover:border-primary/50  bg-secondary p-4 rounded-sm `}
		>
			{history.layout.layout.map(c => (
				<div key={c.type + c.content} className=''>
					{getComponent(c, c.type)}
				</div>
			))}
		</div>
	);
});

export const Characters = memo(({ history }: { history: HistoryPages }) => {
	return (
		<>
			<Carousel
				opts={{
					align: 'start',
					loop: false,
					dragFree: true,
				}}
				className='h-full flex gap-2 overflow-x-hidden'
			>
				<CarouselContent className='h-min w-full px-6 flex gap-2'>
					{history.characters.map(c => {
						const char: any = {
							history: history,
							...c,
						};
						return (
							<CarouselItem
								id={`${c.id}`}
								key={`${c.id} - ${c.name}`}
								className='basis-[40%] h-min sm:basis-[33.5%] md:basis-[25%] lg:basis-[20%] pl-0  rounded-sm text-secondary-foreground'
							>
								<CharacterElement className='aspect-[9/13] ' character={char} />
							</CarouselItem>
						);
					})}
				</CarouselContent>
			</Carousel>
			<div className='w-full justify-center mt-2 hover:fill-primary flex items-center'>
				<CharacterFormModal
					onSubmit={() => {
						runListener('historyChange');
					}}
					type='create'
				>
					<Plus />
				</CharacterFormModal>
			</div>
		</>
	);
});

export const SimilarTabs = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div className='block lg:hidden'>
			<Similar history={history} variant='horizontal' />
		</div>
	);
});

export const TabsInfo = memo(({ history }: { history: HistoryPages }) => {
	const { isAdminOrCreator } = useUserStore();
	const tabs = [
		{
			value: 'Описание',
			visible: history.description || history.genres.length > 0,
			content: <Description history={history} />,
		},
		{
			value: 'Персонажи',
			visible: true,
			content: <Characters history={history} />,
		},
		{
			value: 'Похожие',
			visible: history.similarHistories.length > 0,
			className: 'block lg:hidden',
			content: <SimilarTabs history={history} />,
		},
		{
			value: 'Шаблон',
			visible: history.authorId && isAdminOrCreator(history.authorId),
			content: <LayoutTab history={history} />,
		},
	];
	const [activeTab, setActiveTab] = useState(
		tabs.find(el => el.visible)?.value ?? tabs[0].value
	);

	const uuid = useId();

	return (
		<Tabs className='has-[.tabs-triggers]:block hidden' value={activeTab}>
			<TabsList className='bg-transparent -ml-1 text-xs '>
				{tabs.map((t, i) => (
					<>
						{t.visible && (
							<TabsTrigger
								key={t.value + 'trigger' + i + uuid}
								className={`${
									t.className
								} rounded-none tabs-triggers relative  ${
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
