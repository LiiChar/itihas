import { getPages } from '@/shared/api/page';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { getTimeAgo } from '@/shared/lib/time';
import { Button } from '@/shared/ui/button';
import { useQuery } from '@siberiacancode/reactuse';
import { Link } from 'react-router-dom';

export const PageUpdate = () => {
	const { data: pages } = useQuery(() =>
		getPages({ orders: [{ field: 'createdAt', order: 'desc' }] })
	);

	if (!pages) {
		return (
			<div className='flex justify-center'>
				<Button variant={'ghost'} loading={true}></Button>
			</div>
		);
	}

	return (
		<div className='px-4'>
			<h4>Последние обновления:</h4>
			<div className='my-2 mb-5'>
				{pages && (
					<div className=' flex flex-row gap-2 flex-wrap'>
						{pages.map(page => (
							<div
								className='w-[calc(20%-8px)]  relative min-w-[150px] flex-grow rounded-md overflow-hidden'
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
											<div className='text-[12px] text-white/70'>
												{page.history.name}
											</div>
											<div className='text-[12px] text-white/70'>
												{getTimeAgo(page.createdAt)}
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
						))}
					</div>
				)}
			</div>
		</div>
	);
};
