import { getPages } from '@/shared/api/page';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { getTimeAgo } from '@/shared/lib/time';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
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
					<div className=' flex flex-col gap-3'>
						{pages.map(page => (
							<>
								<div className='w-full flex items-center gap-2'>
									<img
										src={getFullUrl(page.image)}
										onError={handleImageError}
										className='w-full max-w-36'
										alt={`Похожая история ${page.name}`}
									/>
									<div className='flex flex-col  justify-between py-2'>
										<div className='text-[0.9em] text-foreground/90'>
											{page.history.name}
										</div>
										<Link
											to={'/history/' + page.id}
											className='no-underline hover:underline'
										>
											{page.name}
										</Link>
										<div className='text-[0.8em] text-foreground/70'>
											{getTimeAgo(page.created_at)}
										</div>
									</div>
								</div>
								<Separator className='h-[1px] bg-secondary w-full last:hidden' />
							</>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
