import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { HistoryAll } from '@/shared/type/history';
import { useNavigate } from 'react-router-dom';

interface HistoryElementProps {
	history: HistoryAll;
	link?: string;
	option?: {
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
	return (
		<div onClick={() => link && navigate(link)}>
			<img
				src={getFullUrl(history.image)}
				onError={e =>
					handleImageError(e, option?.imageError?.url, option?.imageError?.cb)
				}
				loading='lazy'
				className='object-cover rounded-t-sm w-full aspect-[3/4]'
				alt={history.name}
			/>
			<div className='px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px]'>
				<div className='flex gap-2 text-muted-foreground text-[0.8em]'>
					<div>{history.genres.length > 0 && history.genres[0].genre.name}</div>
					<div>{history.rate}</div>
				</div>
				<div
					className={`${
						option?.nameHeight ? `line-clamp-${option.nameHeight}` : ''
					}`}
				>
					{history.name}
				</div>
			</div>
		</div>
	);
};
