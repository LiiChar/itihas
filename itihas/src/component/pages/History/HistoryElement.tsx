import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { HistoryAll } from '@/shared/type/history';
import { Star } from 'lucide-react';
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

interface HistoryElementProps {
	history: HistoryAll;
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
	history,
	link,
	option,
}: HistoryElementProps) => {
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
				className={`object-cover hover:opacity-70 rounded-t-sm w-full aspect-[3/4] ${imageVariant}`}
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
						{history.rate}
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
