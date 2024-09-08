import {
	useDidUpdate,
	useEvent,
	useMount,
	useQuery,
	useUnmount,
} from '@siberiacancode/reactuse';
import { useParams, Link } from 'react-router-dom';
import { getHistory } from '../shared/api/history';
import { getYear } from '../shared/lib/data';
import { TabsInfo } from '../component/pages/History/Tabs';
import { getFullUrl } from '../shared/lib/image';
import { Wallpaper } from '../component/pages/History/Wallpaper';
import { Info } from '../component/pages/History/Info';
import { Comments } from '../component/pages/History/Comments';
import { Similar } from '../component/pages/History/Similar';
import { Button } from '@/shared/ui/button';
import { useAudioStore } from '@/shared/store/AudioStore';
import { addComponent, removeComponent } from '@/shared/store/LayoutStore';
import { AudioMenu } from '@/component/widget/sound/AudioMenu';

export const History = () => {
	const { id } = useParams();
	const { setAudio } = useAudioStore();
	const { data, isLoading } = useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			if (!data.sound) return;
			setAudio(getFullUrl(data.sound), 'background');
		},
	});

	useMount(() => {
		addComponent(5, AudioMenu as unknown as () => JSX.Element);
	});
	useUnmount(() => {
		removeComponent(5, AudioMenu as unknown as () => JSX.Element);
	});
	if (!data) {
		return;
	}

	return (
		<main className='flex justify-center dark relative pt-6'>
			<Wallpaper src={data.wallpaper ?? data.image} />
			<div className='w-[min(100%,1280px)]  flex gap-5 px-8'>
				<section className='w-[clamp(200px,30%,270px)] min-w-[clamp(200px,30%,270px)] h-min sticky top-[70px] left-0'>
					<div className='w-full '>
						<img
							fetchPriority='high'
							decoding='async'
							data-nimg='fill'
							src={getFullUrl(data?.image)}
							className='aspect-[2/3] object-cover rounded-2xl'
						/>
					</div>
					<div className='flex flex-col gap-3 mt-3'>
						<Link to={`/history/${id}/read`}>
							<Button className='rounded-lg w-full bg-primary font-normal'>
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
							История {getYear(data.created_at)}
						</h5>
						<h1>{data?.name}</h1>
					</div>
					<div className='border-b-[1px] pb-3 border-foreground/30'>
						<Info history={data} />
					</div>
					<div className='flex gap-4'>
						<div>
							<div>
								<TabsInfo history={data} />
							</div>
							<div className='mt-4 flex flex-col gap-2'>
								<h5>Автор</h5>
								<div className='flex gap-2  items-center'>
									<img
										className=''
										width={36}
										height={36}
										src={getFullUrl(data.author.photo)}
										alt='Автор'
									/>
									<h5>{data.author.name}</h5>
								</div>
							</div>
							<div className='mt-4'>
								<Comments comments={data.comments} />
							</div>
						</div>
						<div className='hidden lg:block'>
							<Similar history={data} />
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};
