import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { cn } from '@/shared/lib/lib';
import { HistoryAll } from '@/shared/type/history';
import { Star } from 'lucide-react';
import { HTMLAttributes, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

const Classes = {
	horizontal: {
		image: '',
		wrapper: '',
		info: 'bg-transparent',
	},
	vertical: {
		image: '',
		wrapper: '',
		info: '',
	},
	catalog: {
		image: 'w-full h-full aspect-auto',
		wrapper: 'w-full h-full ',
		info: '',
	},
};

type HistoryElementVariant = 'inner' | 'outer' | 'updated';

interface HistoryElementProps {
	history: HistoryAll;
	variant?: HistoryElementVariant;
	link?: string;
	option?: {
		variant?: keyof typeof Classes;
		imageError?: {
			url?: string;
			cb?: () => void;
		};
		nameHeight?: number;
	};
}

export const HistoryElement = ({
	variant = 'outer',
	...attr
}: HistoryElementProps & HTMLAttributes<HTMLDivElement>) => {
	const Elements: Record<
		HistoryElementVariant,
		(attr: HistoryElementProps) => ReactElement
	> = {
		inner: HistoryElementInner,
		outer: HistoryElementOuter,
		updated: HistoryElementUpdated,
	};

	const Components = Elements[variant];

	return <Components {...attr} />;
};

export const HistoryElementInner = ({
	history,
	link,
	...attr
}: HistoryElementProps & HTMLAttributes<HTMLDivElement>) => {
	const navigate = useNavigate();
	// const wrapperVariant = Classes[option?.variant ?? 'vertical'].wrapper;
	// const imageVariant = Classes[option?.variant ?? 'vertical'].image;
	// const infoVariant = Classes[option?.variant ?? 'vertical'].info;
	return (
		<div
			{...attr}
			className={cn(
				'w-full h-full relative flex-grow rounded-md overflow-hidden',
				attr.className
			)}
			key={history.id}
			onClick={e => {
				if (attr.onClick) {
					attr.onClick(e);
				}
				if (link) {
					navigate(link);
				}
			}}
		>
			<div className='w-full h-full rounded-md flex items-center gap-2 shadow-inset-bottom-md'>
				<img
					src={getFullUrl(history.image)}
					onError={handleImageError}
					className='w-full h-full object-cover rounded-md'
					alt={`Похожая история ${history.name}`}
				/>

				<div className='flex flex-col w-full  justify-between py-2 absolute bottom-0 z-10 px-2'>
					<div className='flex flex-col'>
						<p className='h-min text-white/70 text-[0.7em] leading-3'>
							{history.genres &&
								history.genres.length > 0 &&
								history.genres[0].genre.name}
						</p>
						<p className='text-sm text-white'>{history.name}</p>
					</div>
				</div>

				<div className='flex justify-between items-center absolute top-1 left-1 w-[calc(100%-8px)]'>
					{history.bookmark ? (
						<div className='bg-primary flex justify-center items-center w-min px-1 h-[20px] rounded-lg  text-white text-xs'>
							<span className='h-min w-min text-nowrap gap-1'>
								{history.bookmark}
							</span>
						</div>
					) : (
						<div></div>
					)}

					<div className='bg-primary flex justify-center items-center w-min px-1 h-[20px] rounded-lg  text-white text-xs'>
						<span className='h-min w-min '>{history.like ?? history.rate}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
export const HistoryElementOuter = ({
	history,
	link,
	option,
	...attr
}: HistoryElementProps & HTMLAttributes<HTMLDivElement>) => {
	const navigate = useNavigate();
	// const wrapperVariant = Classes[option?.variant ?? 'vertical'].wrapper;
	const imageVariant = Classes[option?.variant ?? 'vertical'].image;
	const infoVariant = Classes[option?.variant ?? 'vertical'].info;
	return (
		<div
			{...attr}
			className={cn(
				'w-full h-full relative flex-grow rounded-md overflow-hidden',
				attr.className
			)}
			key={history.id}
			onClick={e => {
				if (attr.onClick) {
					attr.onClick(e);
				}
				if (link) {
					navigate(link);
				}
			}}
		>
			<img
				src={getFullUrl(history.image)}
				onError={e =>
					handleImageError(e, option?.imageError?.url, option?.imageError?.cb)
				}
				loading='lazy'
				className={`object-cover hover:opacity-70 rounded-t-sm w-full min-w-full  aspect-[3/4] ${imageVariant}`}
				alt={history.name}
			/>
			<div
				className={` px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px] ${infoVariant}`}
			>
				<div className='flex justify-between gap-2 text-muted-foreground text-xs'>
					<div className='line-clamp-1 hover:line-clamp-none z-10 '>
						{history.genres.length > 0 && history.genres[0].genre.name}
					</div>
					<div className='flex items-center gap-1'>
						{history.like ?? history.rate}
						<Star className='inline fill-current relative top-[-1px] h-[8px] w-[8px]' />
					</div>
				</div>
				<div
					className={`${
						option?.nameHeight ? `line-clamp-${option.nameHeight}` : ''
					} text-sm`}
				>
					{history.name}
				</div>
			</div>
			<div className='flex justify-between items-center absolute top-1 left-1 w-[calc(100%-8px)]'>
				{history.bookmark ? (
					<div className='bg-primary flex justify-center items-center w-min px-1 h-[20px] rounded-lg  text-white text-xs'>
						<span className='h-min w-min text-nowrap gap-1'>
							{history.bookmark}
						</span>
					</div>
				) : (
					<div></div>
				)}

				<div></div>
			</div>
		</div>
	);
};
export const HistoryElementUpdated = ({
	history,
	link,
	option,
}: HistoryElementProps & HTMLAttributes<HTMLDivElement>) => {
	const navigate = useNavigate();
	const wrapperVariant = Classes[option?.variant ?? 'vertical'].wrapper;
	const imageVariant = Classes[option?.variant ?? 'vertical'].image;
	const infoVariant = Classes[option?.variant ?? 'vertical'].info;
	return (
		<div
			className={`w-full  transition-opacity cursor-pointer h-full ${wrapperVariant}`}
			onClick={() => link && navigate(link)}
		>
			<img
				src={getFullUrl(history.image)}
				onError={e =>
					handleImageError(e, option?.imageError?.url, option?.imageError?.cb)
				}
				loading='lazy'
				className={`object-cover hover:opacity-70 rounded-t-sm w-full min-w-full  aspect-[3/4] ${imageVariant}`}
				alt={history.name}
			/>
			<div
				className={` px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px] ${infoVariant}`}
			>
				<div className='flex justify-between gap-2 text-muted-foreground text-[0.7em]'>
					<div className='line-clamp-1 hover:line-clamp-none z-10 '>
						{history.genres.length > 0 && history.genres[0].genre.name}
					</div>
					<div className='flex items-center gap-1'>
						{history.like ?? history.rate}
						<Star className='inline fill-current relative top-[-1px] h-[8px] w-[8px]' />
					</div>
				</div>
				<div
					className={`${
						option?.nameHeight ? `line-clamp-${option.nameHeight}` : ''
					} text-sm`}
				>
					{history.name}
				</div>
			</div>
		</div>
	);
};
