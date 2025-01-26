import { memo, ReactNode, useRef } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { cn } from '../lib/lib';
import { useWindowScroll } from '@siberiacancode/reactuse';

type ScrollTopProp = {
	children?: ReactNode;
	classname?: string;
};

export const ScrollTop = memo(({ children, classname }: ScrollTopProp) => {
	const scrollRef = useRef<HTMLButtonElement>(null);
	const { scrollTo, value } = useWindowScroll();
	const handleScrollTop = () => {
		scrollTo({ y: 0, behavior: 'smooth' });
	};

	return (
		<button
			ref={scrollRef}
			className={cn(
				classname,
				'bottom-8 left-1 fixed z-50',
				value.y < 350 ? 'hidden' : 'block'
			)}
			onClick={handleScrollTop}
		>
			{children ?? <ArrowUpIcon className='h-6 w-6 hover:stroke-primary' />}
		</button>
	);
});
