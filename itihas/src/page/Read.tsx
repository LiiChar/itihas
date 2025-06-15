import {
	useQuery,
	useMount,
	useUnmount,
	useKeyboard,
} from '@siberiacancode/reactuse';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { getPage, resolveAction, runCode } from '../shared/api/page';
import { LayoutComponent } from '../shared/type/layout';
import { ReadPage } from '../shared/type/page';
import {
	fetchCurrentStore,
	setPage,
	usePageStore,
} from '../shared/store/PageStore';
import { Button } from '@/shared/ui/button';
import {
	addComponent,
	removeComponent,
	setHeader,
	setVisibleFooter,
} from '@/shared/store/LayoutStore';
import { AsideHeader } from '@/component/layout/aside';
import { Header } from '@/component/layout/header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useHistoryStore } from '@/shared/store/HistoryStore';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { AudioMenu } from '@/component/widget/sound/AudioMenu';
import { parseInlineStyle } from '@/shared/lib/style';
import { runListener, useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Edit, Layers } from 'lucide-react';
import { EditPageModal } from '@/component/widget/board/Board/EditPageModal';
import { useState } from 'react';
import { toast } from 'sonner';
import { HistoryPages } from '@/shared/type/history';

export const Read = () => {
	const { id } = useParams();
	const [_searchParams, _setSearchParams] = useSearchParams();
	const { history } = useHistoryStore();
	const { user } = useUserStore();
	const { currentPage, page } = usePageStore();
	useQuery(() => fetchCurrentStore(+id!, currentPage), {
		keys: ['currentPage'],
	});
	const { addCallback } = useListenerStore();
	useMount(() => {
		setVisibleFooter(false);
		addCallback('readUpdate', async () => {
			await fetchCurrentStore(+id!, currentPage);
		});
		setHeader(AsideHeader);
		addComponent(5, () => <AudioMenu />);
	});
	useUnmount(() => {
		setVisibleFooter(true);
		setHeader(Header);
		removeComponent(5);
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
			{user &&
				(user.role == 'admin' ||
					(page && page.history.authorId == user.id)) && (
					<div className='absolute bottom-4 left-4 flex flex-col gap-2'>
						<EditPageModal page={page}>
							<Edit className='hover:stroke-primary' />
						</EditPageModal>
						<Link to={`/page/${page.id}/layout`}>
							<Layers className='stroke-foreground hover:stroke-primary' />
						</Link>
					</div>
				)}
			<ReadLayout page={page} history={history ?? undefined} />
		</main>
	);
};

export const ReadLayout = ({
	page,
	history,
}: {
	page: ReadPage;
	history?: HistoryPages;
}) => {
	return (
		<section className='overflow-y-auto h-full'>
			<div className='w-full h-full absolute top-0 left-0 -z-10'>
				<img
					loading='lazy'
					alt='Задний фон'
					className='w-full h-full object-cover opacity-30 blur-lg -z-10'
					src={getFullUrl(page.wallpaper ?? history?.wallpaper ?? page.image)}
					onError={e => handleImageError(e, history?.wallpaper ?? page.image)}
				/>
			</div>
			<div className='w-full h-full flex justify-center items-center'>
				<div className='sm:w-full mx-4 my-2 overflow-y-auto md:w-[clamp(200px,45%,600px)]  flex flex-col gap-2 px-2 pt-2 pb-2 bg-secondary rounded-lg max-h-[90vh] '>
					{(page.layout ?? page.history.layout).layout.map(l =>
						getComponent(l, page, l.type)
					)}
				</div>
			</div>
		</section>
	);
};

type ComponentLayoutDic = LayoutComponent & { page: ReadPage };

export const ImageLayout = ({
	page: _layout,
	style,
	content,
}: ComponentLayoutDic) => {
	const { page } = usePageStore();

	return (
		<div>
			<img
				className='h-[40vh] object-cover w-full rounded-tl-lg rounded-tr-lg'
				style={parseInlineStyle(style ?? '')}
				onError={handleImageError}
				src={getFullUrl(content ?? page?.image ?? '')}
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

export const ContentLayout = ({ page, style }: ComponentLayoutDic) => {
	return (
		<div
			style={parseInlineStyle(style ?? '')}
			className='text-pretty empty:hidden'
		>
			{page.content}
		</div>
	);
};
export const PointLayout = ({ page, style }: ComponentLayoutDic) => {
	const navigate = useNavigate();
	useKeyboard({
		onKeyDown: async event => {
			const keys = Array.from({ length: page.points.length }, (_, i) => i + 1);
			if (!keys.includes(+event.key)) return;

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
		<div
			style={parseInlineStyle(style ?? '')}
			className='flex flex-col justify-start items-start empty:hidden'
		>
			{page.points.map((p, i) => (
				<Button
					variant='ghost'
					className='pl-0 hover:bg-background/30 px-2 pr-3 whitespace-break-spaces text-start py-0'
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

export const ListComponent = ({
	content,
	style,
	elementStyle,
}: ComponentLayoutDic) => {
	return (
		<div style={parseInlineStyle(style ?? '')} className='empty:hidden'>
			{content.split('|||').map(el => (
				<div style={parseInlineStyle(elementStyle ?? '')}>{el}</div>
			))}
		</div>
	);
};

// const ListElement = () => {};

export const TextElement = ({ content, style }: ComponentLayoutDic) => {
	return (
		<span
			style={parseInlineStyle(style ?? '')}
			className='text-pretty empty:hidden'
		>
			{content}
		</span>
	);
};

export const ActionComponent = ({
	page,
	content,
	style,
	option,
}: ComponentLayoutDic) => {
	const { user } = useUserStore();
	const [loading, setLoading] = useState(false);
	return (
		<Button
			style={parseInlineStyle(style ?? '')}
			className='empty:hidden'
			loading={loading}
			onClick={async () => {
				if (loading) return;
				setLoading(true);
				const pageId = await runCode({
					code: content,
					historyId: page.historyId,
					userId: user?.id ?? 1,
				});
				runListener('readUpdate');
				setLoading(false);
				if (pageId) {
					const page = await getPage(pageId);
					if (!page || typeof page == 'string') {
						toast('Страницы по идентификатору ' + pageId + ' не найдено');
						return;
					}
					setPage(page);
				}
			}}
		>
			{option?.action?.title ?? 'Кнопка'}
		</Button>
	);
};

export const BlockComponent = ({ children, page }: ComponentLayoutDic) => {
	return (
		<div className='empty:hidden'>
			{children?.map(c =>
				getComponent(c, page, 'id' in c ? `${c.id}` : c.content + c.type)
			)}
		</div>
	);
};

const LayoutComponents: Record<LayoutComponent['type'], any> = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	action: ActionComponent,
	block: BlockComponent,
	list: ListComponent,
	video: '',
	text: TextElement,
};
