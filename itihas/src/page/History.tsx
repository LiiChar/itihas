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
import { useAudioStore } from '@/shared/store/AudioStore';
import { setHistory, useHistoryStore } from '@/shared/store/HistoryStore';
import { useUserStore } from '@/shared/store/UserStore';
import { BookMarkedIcon, Edit } from 'lucide-react';
import { SelectBookmarks } from '@/component/widget/bookmarks/SelectBookmarks';
import { joinToRoom } from '@/shared/lib/websocket/websocket';
import { HistoryLike } from '@/component/pages/History/HistoryLike';

export const History = () => {
	const { id } = useParams();
	const user = useUserStore(store => store.user);
	const { history } = useHistoryStore();
	const {} = useAudioStore();
	useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			setHistory(data);
		},
	});
	useMount(() => {
		joinToRoom('history', +id!);
	});
	if (!history) {
		return;
	}

	return (
		<main className='flex justify-center  dark relative pt-6'>
			<Wallpaper src={history.wallpaper ?? history.image} />
			<div className='w-[min(100%,1280px)] sm:flex-row flex-col  flex gap-5 px-8'>
				<section className='sm:w-[clamp(200px,30%,270px)] sm:min-w-[clamp(200px,30%,270px)]  h-min md:sticky top-[70px] left-0'>
					<div className='w-full'>
						<img
							// fetchPriority='high'
							decoding='async'
							onError={handleImageError}
							data-nimg='fill'
							src={getFullUrl(history?.image)}
							className=' w-full h-full object-cover rounded-2xl'
						/>
					</div>
					<div className='hidden sm:flex flex-col gap-3 mt-3'>
						<Link to={history.pages.length == 0 ? '' : `/history/${id}/read`}>
							<Button
								disabled={history.pages.length == 0}
								className='rounded-lg w-full bg-primary font-normal'
							>
								Читать
							</Button>
						</Link>
						<SelectBookmarks historyId={history.id}>
							<Button className='rounded-lg bg-primary font-normal w-full text-wrap'>
								Добавить в закладки
							</Button>
						</SelectBookmarks>
						{user?.id == history.author.id && (
							<Link className='w-full' to={`/history/${history.id}/page/edit`}>
								<Button className='rounded-lg bg-primary w-full font-normal text-wrap'>
									Писать историю
								</Button>
							</Link>
						)}
						{user?.id == history.author.id && (
							<Link className='w-full' to={`/history/${history.id}/edit`}>
								<Button className='rounded-lg bg-primary w-full font-normal text-wrap'>
									Редактировать
								</Button>
							</Link>
						)}
						<div>
							<HistoryLike likes={history.likes} historyId={history.id} />
						</div>
					</div>
					<div className='flex sm:hidden sticky bottom-3 left-3 justify-between items-center gap-3 mt-3'>
						{user?.id == history.author.id && (
							<Link className='' to={`/history/${history.id}/page/edit`}>
								<Edit />
							</Link>
						)}
						<Link
							className='w-full'
							to={history.pages.length == 0 ? '' : `/history/${id}/read`}
						>
							<Button
								disabled={history.pages.length == 0}
								className='rounded-lg w-full bg-primary font-normal'
							>
								Читать
							</Button>
						</Link>
						<SelectBookmarks historyId={history.id}>
							<div>
								<BookMarkedIcon />
							</div>
						</SelectBookmarks>
					</div>
				</section>
				<section className='w-full'>
					<div>
						<h5 className='text-secondary-foreground'>
							История {getYear(history.created_at)}
						</h5>
						<h1>{history?.name}</h1>
					</div>
					<div className='border-b-[1px] pb-3 border-foreground/30'>
						<Info history={history} />
					</div>
					<div className='flex gap-4 '>
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
