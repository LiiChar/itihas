import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { Page } from '@/shared/type/page';
import { useNavigate } from 'react-router-dom';

interface PageElementProps {
	page: Page;
	link?: string;
	option?: {
		imageError?: {
			url?: string;
			cb?: () => void;
		};
		nameHeight?: number;
	};
}

export const PageListElement = ({ page, link, option }: PageElementProps) => {
	const navigate = useNavigate();
	return (
		<div onClick={() => link && navigate(link)}>
			<img
				src={getFullUrl(page.image)}
				onError={e =>
					handleImageError(e, option?.imageError?.url, option?.imageError?.cb)
				}
				loading='lazy'
				className='object-cover rounded-t-sm w-full aspect-[3/4]'
				alt={page.name}
			/>
			<div className='px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px]'>
				<div
					className={`${
						option?.nameHeight ? `line-clamp-${option.nameHeight}` : ''
					}`}
				>
					{page.name}
				</div>
			</div>
		</div>
	);
};
