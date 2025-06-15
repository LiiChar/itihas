import { useMount, useQuery } from '@siberiacancode/reactuse';
import { useParams, Link } from 'react-router-dom';
import { getHistory } from '../shared/api/history';
import { getYear } from '../shared/lib/data';
import { TabsInfo } from '../component/pages/History/Tabs';
import { getFullUrl, handleImageError } from '../shared/lib/image';
import { Wallpaper } from '../component/pages/History/Wallpaper';
import { Info } from '../component/pages/History/Info';
import { Comments } from '../component/pages/History/Comments';
import { Similar } from '../component/pages/History/Similar';
import { Button } from '@/shared/ui/button';
import { setHistory, useHistoryStore } from '@/shared/store/HistoryStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Bookmark, BookmarkPlusIcon, MoreVertical } from 'lucide-react';
import { SelectBookmarks } from '@/component/widget/bookmarks/SelectBookmarks';
import { joinToRoom } from '@/shared/lib/websocket/websocket';
import { HistoryLike } from '@/component/pages/History/HistoryLike';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { motion } from 'framer-motion';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export const History = () => {
	const { id } = useParams();
	const user = useUserStore(s => s.user);
	const { isAdminOrCreator } = useUserStore();
	const { history } = useHistoryStore();

	useQuery(() => getHistory(+id!), {
		onSuccess: data => data && setHistory(data),
	});

	const { addCallback } = useListenerStore();
	useMount(() => {
		addCallback('historyChange', async () => {
			const h = await getHistory(+id!);
			setHistory(h);
		});
		joinToRoom('history', +id!);
	});

	if (!history || typeof history === 'string') return null;

	const isBookmarked = history.bookmarks.find(
		bs => bs.bookmark.userId === user?.id
	);
	const readUrl = history.pages.length ? `/history/${history.id}/read` : '';

	return (
		<main className='flex justify-center relative pt-6'>
			<Wallpaper src={history.wallpaper ?? history.image} />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-[min(100%,1280px)] sm:flex-row flex-col flex gap-5 px-8'
			>
				{/* Левая колонка */}
				<motion.section
					layout
					className='sm:w-[clamp(200px,30%,270px)] sm:min-w-[clamp(200px,30%,270px)] h-min md:sticky top-[70px] left-0'
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<img
							onError={handleImageError}
							src={getFullUrl(history.image)}
							className='w-full h-full object-cover rounded-2xl shadow-md'
							alt='История'
						/>
					</motion.div>

					{/* Мобильные действия */}
					<motion.div className='fixed sm:hidden bottom-4 left-4 w-[calc(100%-32px)] flex gap-3 z-50'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='secondary'
									className='aspect-square p-0 rounded-full'
								>
									<MoreVertical size={24} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-full max-w-[300px]'>
								{user && isAdminOrCreator(user.id) && (
									<>
										<Link to={`/history/${history.id}/page/edit`}>
											<Button
												variant={'secondary'}
												className=' w-full font-normal'
											>
												Писать историю
											</Button>
										</Link>
										<Link to={`/history/${history.id}/edit`}>
											<Button
												className=' w-full font-normal'
												variant={'secondary'}
											>
												Редактировать
											</Button>
										</Link>
										<Link to={`/history/${history.id}/variables/`}>
											<Button
												className=' w-full font-normal'
												variant={'secondary'}
											>
												Упаковать рюкзак
											</Button>
										</Link>
										<Link to={`/history/${history.id}/layout/`}>
											<Button
												className=' w-full font-normal'
												variant={'secondary'}
											>
												Изменить шаблон
											</Button>
										</Link>
										<Link to={`/history/${history.id}/progress/`}>
											<Button
												className=' w-full font-normal'
												variant={'secondary'}
											>
												Прохождение
											</Button>
										</Link>
										<Button
											variant='destructive'
											className='rounded-lg w-full font-normal'
										>
											Удалить
										</Button>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						<Link to={readUrl} className='w-full'>
							<Button
								disabled={!history.pages.length}
								className='w-full bg-primary/50 rounded-2xl font-normal backdrop-blur-[10px]'
							>
								Читать
							</Button>
						</Link>

						<SelectBookmarks
							historyId={history.id}
							inBookmark={isBookmarked?.id ?? null}
						>
							<Button
								variant='secondary'
								className='aspect-square p-0 rounded-full'
							>
								{isBookmarked ? (
									<Bookmark size={16} />
								) : (
									<BookmarkPlusIcon size={16} />
								)}
							</Button>
						</SelectBookmarks>
					</motion.div>

					{/* Десктопные действия */}
					<motion.div className='hidden sm:flex flex-col gap-2 mt-3'>
						<Link to={readUrl}>
							<Button
								disabled={!history.pages.length}
								className='rounded-lg w-full bg-primary font-normal'
							>
								Читать
							</Button>
						</Link>

						<SelectBookmarks
							historyId={history.id}
							inBookmark={isBookmarked?.id ?? null}
						>
							{isBookmarked ? (
								<Button
									variant={'secondary'}
									className='rounded-lg w-full font-normal '
								>
									{isBookmarked.bookmark.name}
								</Button>
							) : (
								<Button className='rounded-lg w-full font-normal '>
									Добавить в закладки
								</Button>
							)}
						</SelectBookmarks>

						{user && isAdminOrCreator(user.id) && (
							<>
								<Link to={`/history/${history.id}/page/edit`}>
									<Button className='rounded-lg bg-primary w-full font-normal'>
										Писать историю
									</Button>
								</Link>
								<Link to={`/history/${history.id}/edit`}>
									<Button className='rounded-lg bg-primary w-full font-normal'>
										Редактировать
									</Button>
								</Link>
								<Link to={`/history/${history.id}/variables/`}>
									<Button className='rounded-lg bg-primary w-full font-normal'>
										Упаковать рюкзак
									</Button>
								</Link>
								<Link to={`/history/${history.id}/layout/`}>
									<Button className='rounded-lg bg-primary w-full font-normal'>
										Изменить шаблон
									</Button>
								</Link>
								<Link to={`/history/${history.id}/progress/`}>
									<Button className='rounded-lg bg-primary w-full font-normal'>
										Прохождение
									</Button>
								</Link>
								<Button
									variant='destructive'
									className='rounded-lg w-full font-normal'
								>
									Удалить
								</Button>
							</>
						)}
					</motion.div>
				</motion.section>

				{/* Правая колонка */}
				<motion.section
					layout
					className='w-full overflow-hidden'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div>
						<h5 className='text-secondary-foreground/60 -mb-2'>
							История {getYear(history.createdAt ?? new Date())}
						</h5>
						<h1 className='text-3xl font-semibold'>{history.name}</h1>
					</div>

					<div className='border-b-[1px] pb-3 border-foreground/30'>
						<Info history={history} />
					</div>

					<div className='flex gap-4'>
						<div className='w-full'>
							<TabsInfo history={history} />

							{history.author && (
								<div className='mt-4 flex flex-col gap-2'>
									<h5>Автор</h5>
									<Link
										to={`/profile/${history.authorId}`}
										className='flex gap-2 items-center'
									>
										<img
											className='rounded-full'
											width={36}
											height={36}
											src={getFullUrl(history.author.photo)}
											alt='Автор'
										/>
										<h5>{history.author.name}</h5>
									</Link>
								</div>
							)}

							<div className='mt-4 relative'>
								<div className='absolute top-2 right-0 w-[100px]'>
									<HistoryLike likes={history.likes} historyId={history.id} />
								</div>
								<Comments comments={history.comments} />
							</div>
						</div>

						<div className='hidden lg:block'>
							<Similar history={history} />
						</div>
					</div>
				</motion.section>
			</motion.div>
		</main>
	);
};
