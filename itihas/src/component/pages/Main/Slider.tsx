import { ReactNode, useState } from 'react';
import { HistoryAll } from '../../../shared/type/history';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '../../../shared/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { getFullUrl } from '@/shared/lib/image';

type Slider = {
	startSlide?: number;
	histories: HistoryAll[];
	width?: number;
	height?: number;
	keyImage?: string;
	keyTitle?: string;
	title?: ReactNode;
	link?: ReactNode;
	countView?: number;
	onClickSlide?: (e: any, slide: HistoryAll) => void;
	onHoverSlide?: (e: any, slide: HistoryAll) => void;
	addSlide?: (slide: HistoryAll) => void;
	removeSlide?: (id: HistoryAll | number) => void;
	setSlides?: (slides: HistoryAll[]) => void;
};

export const Slider = ({ link, histories, title }: Slider) => {
	const [slides, _setSlides] = useState<HistoryAll[]>(histories);
	const navigate = useNavigate();

	return (
		<section className='h-auto'>
			<div className='flex justify-between'>
				<h4>{title}</h4>
				<div>{link}</div>
			</div>
			<div className='h-full'>
				<Carousel
					opts={{
						align: 'start',
						loop: false,
						dragFree: true,
					}}
					className='h-full flex gap-2 '
				>
					<CarouselContent className='h-full px-6 flex gap-2'>
						{slides.map(s => (
							<CarouselItem
								id={`${s.id}`}
								object-cover
								className='basis-[30%] sm:basis-[20%] md:basis-[14%] lg:basis-[10%] pl-0 bg-secondary rounded-sm text-secondary-foreground'
								onClick={() => navigate(`/history/${s.id}`)}
							>
								<img
									src={getFullUrl(s.image)}
									loading='lazy'
									className='object-cover rounded-t-sm w-full aspect-[3/4]'
									alt={s.name}
								/>
								<div className='px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px]'>
									<div className='flex gap-2 text-muted-foreground text-[0.8em]'>
										<div>{s.genres.length > 0 && s.genres[0].genre.name}</div>
										<div>{s.rate}</div>
									</div>
									<div>{s.name}</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
};
