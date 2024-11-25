import { useQuery, useField } from '@siberiacancode/reactuse';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { setHistory, useHistoryStore } from '@/shared/store/HistoryStore';
import { getHistory } from '@/shared/api/history';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { Wallpaper } from '@/component/pages/History/Wallpaper';
import { getYear } from '@/shared/lib/data';
import { Similar } from '@/component/pages/History/Similar';
import { Input } from '@/shared/ui/input';
import { Genres } from '@/component/pages/History/Genres';
import { memo, useState } from 'react';
import { HistoryPages } from '@/shared/type/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ReplyIcon } from 'lucide-react';
import { CommentWithUser } from '@/shared/type/comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { getTimeAgo } from '@/shared/lib/time';
import { Textarea } from '@/shared/ui/textarea';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { CharacterElement } from '@/component/pages/History/CharacterElement';

export const HistoryEdit = () => {
	const { id } = useParams();
	const { history } = useHistoryStore();
	useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			setHistory(data);
		},
	});
	const nameField = useField({ initialValue: history?.name });
	if (!history) {
		return '';
	}

	return (
		<main className='flex justify-center dark relative pt-6'>
			<Wallpaper src={history.wallpaper ?? history.image} />
			<div className='w-[min(100%,1280px)]  flex gap-5 px-8'>
				<section className='w-[clamp(200px,30%,270px)] min-w-[clamp(200px,30%,270px)] h-min sticky top-[70px] left-0'>
					<div className='w-full '>
						<img
							// fetchPriority='high'
							decoding='async'
							onError={handleImageError}
							data-nimg='fill'
							src={getFullUrl(history?.image)}
							className='aspect-[2/3] object-cover rounded-2xl'
						/>
					</div>
					<div className='flex flex-col gap-3 mt-3'>
						<Link to={history.pages.length == 0 ? '' : `/history/${id}/read`}>
							<Button className='rounded-lg w-full bg-primary font-normal'>
								Сохранить
							</Button>
						</Link>
					</div>
				</section>
				<section>
					<div>
						<h5 className='text-secondary-foreground'>
							История {getYear(history.created_at)}
						</h5>
						<Input
							className='border-white text-2xl h-9'
							{...nameField.register()}
						/>
					</div>
					<div className='border-b-[1px] pb-3 border-foreground/30'>
						<Info history={history} />
					</div>
					<div className='flex gap-4'>
						<div>
							<div>
								<TabsInfo history={history} />
							</div>
							<div className='mt-4 flex flex-col gap-2'>
								<h5>Автор</h5>
								<div className='flex gap-2  items-center'>
									<img
										className=''
										width={36}
										height={36}
										src={getFullUrl(history.author.photo)}
										alt='Автор'
									/>
									<h5>{history.author.name}</h5>
								</div>
							</div>
							<div className='mt-4'>
								<Comments comments={history.comments} />
							</div>
						</div>
						<div className='hidden lg:block'>
							<Similar history={history} />
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};

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
							className='basis-[30%] object-cover h-min sm:basis-[20%] md:basis-[14%] lg:basis-[10%] pl-0 bg-secondary rounded-sm text-secondary-foreground'
						>
							<CharacterElement character={char} />
						</CarouselItem>
					);
				})}
			</CarouselContent>
		</Carousel>
	);
});

export const Description = memo(({ history }: { history: HistoryPages }) => {
	const descriptionField = useField({
		initialValue: history?.description ?? '',
	});
	return (
		<div>
			<Textarea
				{...descriptionField.register()}
				className='mb-5 border-white h-28'
			/>
			<div>
				<Genres history={history} />
			</div>
		</div>
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
						className={`rounded-none text-foreground ${
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

export const Comments = memo(
	({ comments }: { comments: CommentWithUser[] }) => {
		return (
			<div>
				<h3>Комментарии</h3>
				<div className='flex flex-col gap-4 mt-3'>
					{comments.map(c => (
						<Comment key={c.id} comment={c} />
					))}
				</div>
			</div>
		);
	}
);

export const Comment = memo(({ comment }: { comment: CommentWithUser }) => {
	const [visible, setVisible] = useState(comment.content.length < 270);
	return (
		<article className='w-full flex gap-2' key={comment.id}>
			<Avatar className='w-9 h-9 mt-1'>
				<AvatarImage
					alt={`Фотография пользователя ${comment.user.name}`}
					src={getFullUrl(comment.user.photo)}
				/>
				<AvatarFallback>{comment.user.name}</AvatarFallback>
			</Avatar>
			<div className='w-full'>
				<div className='bg-secondary px-2 py-1 rounded-lg '>
					<div>
						<div className='font-bold'>{comment.user.name}</div>
						<div>{comment.user.dignity}</div>
					</div>
					<div>
						<div className={!visible ? 'line-clamp-3' : ''}>
							{comment.content}
						</div>
						<Button
							className='font-normal text-primary normal-case p-0 m-0 h-min'
							variant='ghost'
							onClick={() => setVisible(prev => !prev)}
						>
							{visible ? 'Скрыть' : 'Открыть'}
						</Button>
					</div>
				</div>
				<div className='flex justify-between mt-1 ml-2 items-center'>
					<div className='flex gap-3 items-center'>
						<div className='flex gap-2 items-center'>
							<div>{comment.rate ?? 0}</div>
						</div>
						<div>
							<ReplyIcon height={18} width={18} />
						</div>
					</div>
					<div className='text-xs'>{getTimeAgo(comment.updatedAt)}</div>
				</div>
			</div>
		</article>
	);
});

const translate = {
	status: {
		announcement: 'Анонсирован',
		complete: 'Завершен',
		write: 'Выпускается',
		frozen: 'Заморожен',
	},
	type: {
		free: 'Доступная',
		paid: 'Планая',
	},
};

export const Info = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div className='flex gap-3 mt-2 border-b-1 flex-wrap text-sm'>
			<div>
				<p className='text-secondary-foreground '>Страниц</p>
				<p>{history.pages.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Статус</p>
				<p>{translate['status'][history.status]}</p>
			</div>

			<div>
				<p className='text-secondary-foreground'>Тип истории</p>
				<p>{translate['type'][history.type]}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Рейтинг</p>
				<p>{history.rate}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Прочитано</p>
				<p>{history.views}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Закладки</p>
				<p>{history.bookmarks.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>PG</p>
				<p>{history.minAge ?? 0}+</p>
			</div>
		</div>
	);
});
