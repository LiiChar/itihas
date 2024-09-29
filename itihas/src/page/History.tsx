import { useQuery } from '@siberiacancode/reactuse';
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

export const History = () => {
	const { id } = useParams();
	const { history } = useHistoryStore();
	const { setAudio } = useAudioStore();
	const {} = useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			setHistory(data);
			if (!data.sound) return;
			setAudio(getFullUrl(data.sound), 'background');
		},
	});
	if (!history) {
		return;
	}

	return (
		<main className='flex justify-center dark relative pt-6'>
			<Wallpaper src={history.wallpaper ?? history.image} />
			<div className='w-[min(100%,1280px)]  flex gap-5 px-8'>
				<section className='w-[clamp(200px,30%,270px)] min-w-[clamp(200px,30%,270px)] h-min sticky top-[70px] left-0'>
					<div className='w-full '>
						<img
							fetchPriority='high'
							decoding='async'
							onError={handleImageError}
							data-nimg='fill'
							src={getFullUrl(history?.image)}
							className='aspect-[2/3] object-cover rounded-2xl'
						/>
					</div>
					<div className='flex flex-col gap-3 mt-3'>
						<Link to={history.pages.length == 0 ? '' : `/history/${id}/read`}>
							<Button
								disabled={history.pages.length == 0}
								className='rounded-lg w-full bg-primary font-normal'
							>
								Читать
							</Button>
						</Link>
						<Button className='rounded-lg bg-primary font-normal text-wrap'>
							Добавить в закладки
						</Button>
					</div>
				</section>
				<section>
					<div>
						<h5 className='text-secondary-foreground'>
							История {getYear(history.created_at)}
						</h5>
						<h1>{history?.name}</h1>
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
