import { useQuery } from '@siberiacancode/reactuse';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCurrentPage, resolveAction } from '../shared/api/page';
import { Suspense, useState } from 'react';
import { LayoutComponent } from '../shared/type/layout';
import { ReadPage } from '../shared/type/page';
import {
	fetchCurrentStore,
	setPage,
	usePageStore,
} from '../shared/store/PageStore';
import { Button } from '@/shared/ui/button';

export const Read = () => {
	const { id } = useParams();
	useQuery(() => fetchCurrentStore(+id!, currentPage), {
		keys: ['currentPage'],
	});
	const { currentPage, page } = usePageStore();

	if (!page) {
		return 'Loading..';
	}

	return (
		<main>
			<div className='w-full h-full absolute top-0 left-0 -z-10'>
				<img
					alt='Задний фон'
					className='w-full h-full object-cover opacity-30 blur-lg -z-10'
					src={page.image}
				/>
			</div>
			<div className='w-full h-full flex justify-center items-center'>
				<div className='w-[clamp(200px,45%,700px)] mx-4 my-12 px-2 pt-2 pb-4 bg-secondary rounded-lg'>
					{(page.layout ?? page.history.layout).layout.map(l =>
						getComponent(l, page)
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
				className='rounded-tl-lg rounded-tr-lg'
				src={page.image}
				alt='Основное изображение'
			/>
		</div>
	);
};

export const getComponent = (layout: LayoutComponent, page: ReadPage) => {
	const Component = LayoutComponents[layout.type];
	return <Component {...layout} page={page} />;
};

export const ContentLayout = ({ page }: ComponentLayoutDic) => {
	return <div className='text-pretty'>{page.content}</div>;
};
export const PointLayout = ({ page }: ComponentLayoutDic) => {
	let [searchParams, setSearchParans] = useSearchParams();
	const resolvePoint = async (id: number) => {
		const page = await resolveAction(id);
		setPage(page);
	};
	return (
		<div>
			{page.points.map(p => (
				<Button variant='ghost'>
					<Link
						onClick={() => resolvePoint(p.id)}
						to={`?page=${p.id}`}
						key={p.id}
					>
						{p.name}
					</Link>
				</Button>
			))}
		</div>
	);
};
export const CustomLayout = ({ page }: ComponentLayoutDic) => {
	return 'custom';
};

const LayoutComponents = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	custom: CustomLayout,
};
