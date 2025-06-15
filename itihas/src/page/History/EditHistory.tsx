import { useQuery } from '@siberiacancode/reactuse';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { setHistory, useHistoryStore } from '@/shared/store/HistoryStore';
import { getHistory, updateHistory } from '@/shared/api/history';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { Wallpaper } from '@/component/pages/History/Wallpaper';
import { getYear } from '@/shared/lib/data';
import { Similar } from '@/component/pages/History/Similar';
import { Input } from '@/shared/ui/input';
import { Genres } from '@/component/pages/History/Genres';
import { memo, useState } from 'react';
import { Genre, HistoryPages } from '@/shared/type/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ReplyIcon } from 'lucide-react';
import { CommentWithUser } from '@/shared/type/comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { getTimeAgo } from '@/shared/lib/time';
import { Textarea } from '@/shared/ui/textarea';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select';
import { ImageUpload } from '@/component/widget/form/ImageUpload';
import { CharacterElement } from '@/component/widget/character/CharacterElement';
import { MarkdownEditor } from '@/shared/ui/markdown-editor';
import { MultiSelect } from '@/shared/ui/multi-select';
import { getGenres } from '@/shared/api/genre';
import Markdown from 'react-markdown';
import { cn } from '@/shared/lib/lib';
import remarkGfm from 'remark-gfm';
import { Stats } from 'fs';
export const HistoryEdit = () => {
	const { id } = useParams();
	const { history } = useHistoryStore();
	const navigate = useNavigate();
	useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			setHistory(data);
		},
	});
	if (!history) {
		return '';
	}

	const handleEditHistory = async () => {
		await updateHistory(history.id, history);
		navigate('/history/' + history.id);
	};

	return (
		<main className='flex justify-center relative pt-6'>
			<Wallpaper src={history.wallpaper ?? history.image} />
			<div className='w-[min(100%,1280px)] sm:flex-row flex-col  flex gap-5 px-8'>
				<section className='sm:w-[clamp(200px,30%,270px)] sm:min-w-[clamp(200px,30%,270px)]  h-min md:sticky top-[70px] left-0'>
					<div className='w-full '>
						<ImageUpload
							src={history?.image}
							onUpload={path => {
								useHistoryStore.setState(state => {
									if (state.history) {
										state.history.image = path;
									}
									return Object.assign({}, state);
								});
							}}
							className='aspect-[2/3] object-cover rounded-2xl'
						/>
					</div>
					<div className='flex flex-col gap-3 mt-3'>
						<Button
							onClick={handleEditHistory}
							className='rounded-lg w-full bg-primary font-normal'
						>
							Сохранить
						</Button>
					</div>
				</section>
				<section className='w-full overflow-hidden max-w-full	'>
					<div>
						<h5 className='text-secondary-foreground'>
							История {getYear(history.createdAt)}
						</h5>
						<Input
							className='border-white text-2xl h-9'
							defaultValue={history.name}
							onInput={e => {
								useHistoryStore.setState(state => {
									if (state.history) {
										state.history.name = e.currentTarget.value;
										return state;
									}
									return state;
								});
							}}
						/>
					</div>
					<div className='border-b-[1px] pb-3 border-foreground/30'>
						<Info />
					</div>
					<div className='flex gap-4'>
						<div className='w-full'>
							<div>
								<TabsInfo history={history} />
							</div>
							{history.author && (
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
							)}
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
	const { history: h } = useHistoryStore();
	const { data } = useQuery<Genre[]>(() => getGenres(), { initialData: [] });
	return (
		<div>
			<MarkdownEditor
				defaultValue={history.description ?? ''}
				value={h?.description ?? ''}
				onChange={e => {
					console.log(e);

					useHistoryStore.setState(state => {
						if (state.history) {
							state.history.description = e.toString();
						}
						return Object.assign({}, state);
					});
				}}
				className='border-white h-28'
				placeholder='Напиши описание истории'
			/>
			<div>
				<div className='text-lg'>Жанры</div>
				<MultiSelect
					variant='inverted'
					placeholder='Выберите жанр'
					options={
						data
							? data.map(d => ({ id: d.id, value: d.name, label: d.name }))
							: ([] as any)
					}
					onValueChange={s => {
						useHistoryStore.setState(state => {
							const genresId = s.reduce<{ genre: Genre }[]>((acc, n) => {
								const gen = data!.find(g => g.name === n);
								if (gen) {
									acc.push({ genre: gen });
								}
								return acc;
							}, []);
							if (state.history && genresId) {
								state.history.genres = genresId;
							}
							return Object.assign({}, state);
						});
					}}
					defaultValue={history.genres?.map(g => g.genre.name) ?? []}
				/>
				{/* <Genres history={history} /> */}
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
	const [content, setContent] = useState(comment.content);
	return (
		<article className='w-full flex gap-2' key={comment.id}>
			<Avatar className='w-9 h-9 mt-1'>
				<AvatarImage
					alt={`Фотография пользователя ${comment.user.name}`}
					src={getFullUrl(comment.user.photo)}
				/>
				<AvatarFallback>{comment.user.name}</AvatarFallback>
			</Avatar>
			<div className='w-full overflow-hidden'>
				<div className='bg-secondary px-2 py-1 rounded-lg '>
					<div>
						<div className='font-bold'>{comment.user.name}</div>
						<div>{comment.user.dignity}</div>
					</div>
					<div>
						<div
							className={cn(
								'prose markdown break-words break-spaces text-foreground'
							)}
						>
							<MarkdownEditor
								defaultValue={comment.content}
								value={content}
								onChange={e => {
									setContent(e.toString());
									useHistoryStore.setState(state => {
										if (state.history) {
											const currentCommentIndex =
												state.history?.comments.findIndex(
													c => c.id === comment.id
												);
											state.history.comments[currentCommentIndex].content =
												e.toString();
										}
										return { ...state };
									});
								}}
								placeholder='Измение комментарий'
							/>
						</div>
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

export const Info = memo(() => {
	const { history } = useHistoryStore();
	return (
		<div className='flex gap-3 mt-2 border-b-1 flex-wrap text-sm'>
			<div>
				<p className='text-secondary-foreground '>Страниц</p>
				<p className=''>{history!.pages.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Статус</p>
				<Select
					value={history!.status}
					onValueChange={it =>
						useHistoryStore.setState(state => {
							if (state.history) {
								state.history.status = it as any;
							}
							return Object.assign({}, state);
						})
					}
				>
					<SelectTrigger>
						<SelectValue
							placeholder='Статус'
							defaultValue={translate['status'][history!.status]}
						/>
					</SelectTrigger>
					<SelectContent>
						{['complete', 'write', 'frozen', 'announcement'].map((it: any) => (
							<SelectItem key={it} value={it}>
								{(translate['status'] as any)[it]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<p className='text-secondary-foreground'>Тип истории</p>
				<Select
					value={history!.type}
					onValueChange={it =>
						useHistoryStore.setState(state => {
							if (state.history) {
								state.history.type = it as any;
							}
							return Object.assign({}, state);
						})
					}
				>
					<SelectTrigger>
						<SelectValue
							placeholder='Статус'
							defaultValue={translate['type'][history!.type]}
						/>
					</SelectTrigger>
					<SelectContent>
						{['free', 'paid'].map((it: any) => (
							<SelectItem value={it}>
								{(translate['type'] as any)[it]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div>
				<p className='text-secondary-foreground'>Рейтинг</p>
				<p>{history!.rate}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Прочитано</p>
				<p>{history!.views}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Закладки</p>
				<p>{history!.bookmarks.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>PG</p>
				<p className='flex items-center'>
					<Input
						type='number'
						maxLength={3}
						value={history!.minAge ?? 0}
						placeholder='0'
						className='w-14 min-6 p-1'
						onChange={e =>
							useHistoryStore.setState(state => {
								if (state.history && e.currentTarget.value.length < 4) {
									state.history.minAge = +e.currentTarget.value;
								}
								return Object.assign({}, state);
							})
						}
					/>
				</p>
			</div>
		</div>
	);
});
