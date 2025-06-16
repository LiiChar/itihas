import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { formatDate } from '@/shared/lib/time';
import { Page } from '@/shared/type/page';
import { Link } from 'react-router-dom';

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

export const PageListElement = ({ page }: PageElementProps) => {
	return (
		<div
			className='relative min-w-[150px] flex-grow rounded-md overflow-hidden'
			key={page.id + page.historyId}
		>
			<div className='w-full h-full rounded-md flex items-center gap-2 shadow-inset-bottom-full'>
				<img
					src={getFullUrl(page.image)}
					onError={handleImageError}
					className='w-full h-full object-contain rounded-md'
					alt={`Похожая история ${page.name}`}
				/>
				<div className='flex flex-col w-full  justify-between py-2 absolute bottom-0 z-10 px-2'>
					<div className='flex items-center flex-wrap justify-between'>
						{/* <div className='text-[12px] text-white/70'>{page.history.name}</div> */}
						<div className='text-[12px] text-white/70'>
							{formatDate(page.createdAt)}
						</div>
					</div>
					<Link
						to={'/history/' + page.id}
						className='text-white no-underline hover:underline text-[18px]'
					>
						{page.name}
					</Link>
				</div>
			</div>
		</div>
	);
};
