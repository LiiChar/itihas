import { ReactNode, memo, useState } from 'react';
import { HistoryAll } from '../../../shared/type/history';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '../../../shared/ui/carousel';
import { HistoryElement } from '../History/HistoryElement';
import { Link } from 'react-router-dom';
import { ShevronArrow } from '@/shared/ui/shevron-arrow';

type Slider = {
	startSlide?: number;
	histories: HistoryAll[];
	width?: number;
	height?: number;
	keyImage?: string;
	keyTitle?: string;
	title?: ReactNode;
	link?: {
		src?: string;
		title?: string;
	};
	countView?: number;
	onClickSlide?: (e: any, slide: HistoryAll) => void;
	onHoverSlide?: (e: any, slide: HistoryAll) => void;
	addSlide?: (slide: HistoryAll) => void;
	removeSlide?: (id: HistoryAll | number) => void;
	setSlides?: (slides: HistoryAll[]) => void;
};

export const Slider = memo(({ link, histories, title }: Slider) => {
	const [slides, _setSlides] = useState<HistoryAll[]>(histories);

	return (
		<section className='h-min w-full'>
			<div className='flex justify-between items-center px-2 mb-1'>
				<h4>{title}</h4>
				{link && link.src && (
					<div>
						<Link title={link.title} to={link.src}>
							<span className='md:inline hidden '>{link.title}</span>
							<ShevronArrow className='md:hidden' />
						</Link>
					</div>
				)}
			</div>
			<div className='h-full w-full'>
				<Carousel
					opts={{
						align: 'start',
						loop: false,
						dragFree: true,
					}}
					className='h-full w-full flex gap-2 '
				>
					<CarouselContent className='h-min w-full px-6 flex gap-2'>
						{slides.map(s => (
							<CarouselItem
								id={`${s.id}`}
								key={`${s.id}`}
								className='basis-[30%] h-min sm:basis-[20%] md:basis-[14%] lg:basis-[10%] pl-0 bg-secondary rounded-sm text-secondary-foreground'
							>
								<HistoryElement
									option={{ nameHeight: 1, variant: 'horizontal' }}
									history={s}
									link={`/history/${s.id}`}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
});
