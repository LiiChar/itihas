import { HistoryPages } from '../../../shared/type/history';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '../../../shared/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { getFullUrl } from '@/shared/lib/image';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const SimilarSlider = ({ history }: { history: HistoryPages }) => {
	const navigate = useNavigate();

	return (
		<section className='h-auto'>
			<div className='flex items-center'>
				<h4>Похожее</h4>
				<div>
					<Button
						variant='link'
						className='font-normal text-primary normal-case'
					>
						Добавить
					</Button>
				</div>
			</div>
			<div className='h-full'>
				<Carousel
					opts={{
						align: 'start',
						loop: false,
						dragFree: true,
					}}
					className='h-full flex  gap-2 '
				>
					<CarouselContent className='h-full px-6 flex gap-2'>
						{history.similarHistories.map(s => (
							<CarouselItem
								id={`${s.id}`}
								object-cover
								className='basis-[30%] w-full sm:basis-[20%] md:basis-[14%] lg:basis-[10%] pl-0 bg-secondary rounded-sm text-secondary-foreground'
								onClick={() => navigate(`/history/${s.id}`)}
							>
								<div key={s.id} className='flex flex-col'>
									<div>
										<img
											src={getFullUrl(s.similarHistory.image)}
											alt={`Похожая история ${s.similarHistory.name}`}
										/>
									</div>
									<div className='flex flex-col justify-between'>
										<div>{s.similarHistory.name}</div>
										<div className='flex gap-1 items-center justify-between'>
											<div>
												<Minus />
											</div>
											<div>{s.similar ?? 0}</div>
											<div>
												<Plus />
											</div>
										</div>
									</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
};
