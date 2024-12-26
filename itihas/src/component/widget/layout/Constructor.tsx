import { handleImageError } from '@/shared/lib/image';
import { LayoutComponent } from '@/shared/type/layout';
import { Button } from '@/shared/ui/button';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';

export const Constructor = () => {
	return (
		<Stage width={window.innerWidth} height={window.innerHeight}>
			<Layer>
				<Html>
					{Object.entries(LayoutComponents).map(([name, comp]) => (
						<div>
							<div>{name}</div>
							<div>{comp}</div>
						</div>
					))}
				</Html>
			</Layer>
		</Stage>
	);
};

export const ContentLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='text-pretty'>
			<div className=' flex justify-center items-center aspect-[16/4] animate-pulse bg-background'>
				Содержание
			</div>
		</div>
	);
};

export const PointLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='flex aspect-[16/5] flex-col gap-2 justify-start items-start'>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3 animate-pulse bg-background'>
				Пункты выбора
			</div>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
		</div>
	);
};

export const ImageLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='relative aspect-[12/9] w-full animate-pulse bg-background  flex justify-center items-center'>
			<img
				className='absolute top-0 left-0 h-full aspect-[12/9] object-cover w-full rounded-tl-lg rounded-tr-lg'
				src={''}
				alt=''
				onError={handleImageError}
			/>
			Изображение
		</div>
	);
};

export const CustomLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const ActionLayout = ({}: { c: LayoutComponent }) => {
	return <Button>Действие</Button>;
};

export const ListLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='flex aspect-[16/5] flex-col gap-2 justify-start items-start'>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3 animate-pulse bg-background'>
				Список
			</div>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
		</div>
	);
};

export const BlockLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const VideoLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const TextLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

const LayoutComponents: Record<string, any> = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	action: ActionLayout,
	list: ListLayout,
	block: BlockLayout,
	video: VideoLayout,
	text: TextLayout,
};
