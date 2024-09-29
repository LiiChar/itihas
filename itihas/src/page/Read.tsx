import {
	useQuery,
	useMount,
	useUnmount,
	useKeyboard,
} from '@siberiacancode/reactuse';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { resolveAction } from '../shared/api/page';
import { LayoutComponent } from '../shared/type/layout';
import { ReadPage } from '../shared/type/page';
import {
	fetchCurrentStore,
	setPage,
	usePageStore,
} from '../shared/store/PageStore';
import { Button } from '@/shared/ui/button';
import { setHeader, setVisibleFooter } from '@/shared/store/LayoutStore';
import { AsideHeader } from '@/component/layout/aside';
import { Header } from '@/component/layout/header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useHistoryStore } from '@/shared/store/HistoryStore';
import { handleImageError } from '@/shared/lib/image';

export const Read = () => {
	const { id } = useParams();
	const [searchParams, _setSearchParams] = useSearchParams();
	const { history } = useHistoryStore();
	const { currentPage, page } = usePageStore();
	useQuery(
		() =>
			fetchCurrentStore(
				+id!,
				searchParams.has('page') ? +searchParams.get('page')! : currentPage
			),
		{
			keys: ['currentPage'],
		}
	);
	useMount(() => {
		setVisibleFooter(false);
		setHeader(AsideHeader);
	});
	useUnmount(() => {
		setVisibleFooter(true);
		setHeader(Header);
	});

	if (!page) {
		return (
			<div className='w-full h-full flex justify-center items-center'>
				<div className='w-100% md:w-[clamp(200px,45%,500px)] flex flex-col gap-2 mx-4 my-12 px-2 pt-2 pb-4 bg-secondary rounded-lg'>
					<Skeleton className='w-full h-[70vh]' />
				</div>
			</div>
		);
	}

	return (
		<main className='h-screen'>
			<div className='w-full h-full absolute top-0 left-0 -z-10'>
				<img
					loading='lazy'
					alt='Задний фон'
					className='w-full h-full object-cover opacity-30 blur-lg -z-10'
					src={
						page.wallpaper?.source ??
						page.history.wallpaper?.source ??
						page.image ??
						history?.wallpaper
					}
					onError={e => handleImageError(e, history?.wallpaper ?? page.image)}
				/>
			</div>
			<div className='w-full h-full flex justify-center items-center'>
				<div className='sm:w-full sm:mt-0 my-4 md:w-[clamp(200px,45%,500px)] flex flex-col gap-2 mx-4  px-2 pt-2 pb-2 bg-secondary rounded-lg  '>
					{(page.layout ?? page.history.layout).layout.map(l =>
						getComponent(l, page, l.type)
					)}
				</div>
			</div>
		</main>
	);
};

type ComponentLayoutDic = LayoutComponent & { page: ReadPage };

export const ImageLayout = ({ page }: ComponentLayoutDic) => {
	return (
		<div>
			<img
				className='h-[40vh] object-cover w-full rounded-tl-lg rounded-tr-lg'
				src={page.image}
				alt='Основное изображение'
			/>
		</div>
	);
};

export const getComponent = (
	layout: LayoutComponent,
	page: ReadPage,
	key: string | number
) => {
	const Component = LayoutComponents[layout.type];
	return <Component {...layout} page={page} key={key} />;
};

export const ContentLayout = ({ page }: ComponentLayoutDic) => {
	return <div className='text-pretty'>{page.content}</div>;
};
export const PointLayout = ({ page }: ComponentLayoutDic) => {
	const navigate = useNavigate();
	useKeyboard({
		onKeyDown: async event => {
			const keys = Array.from({ length: page.points.length }, (_, i) => i + 1);
			if (!keys.includes(+event.key)) return;
			console.log(event.key);

			const points = page.points[+event.key!];
			await resolvePoint(points.id);
		},
	});
	const resolvePoint = async (id: number) => {
		const page = await resolveAction(id);
		setPage(page);
		navigate(`?page=${id}`);
	};
	return (
		<div className='flex flex-col justify-start items-start'>
			{page.points.map((p, i) => (
				<Button
					variant='ghost'
					className='pl-0 whitespace-break-spaces text-start py-1'
					onClick={() => resolvePoint(p.id)}
					key={p.id}
				>
					{`${i + 1}. ${p.name}`}
				</Button>
			))}
		</div>
	);
};
export const CustomLayout = ({}: ComponentLayoutDic) => {
	return 'custom';
};

const LayoutComponents = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	custom: CustomLayout,
};
