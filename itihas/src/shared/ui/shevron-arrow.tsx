import { ChevronRightIcon } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/lib';

type ShevronArrowProps = React.HTMLAttributes<HTMLSpanElement>;

export const ShevronArrow = ({ ...attr }: ShevronArrowProps) => {
	return (
		<span
			{...attr}
			className={cn(
				'flex relative after:content-[""] after:absolute after:border-b-[3px] after:w-4 after:top-[calc(50%-1px)] hover:after:w-8 hover:after:-ml-4 after:transition-all transition-all text-foreground after::border-foreground hover:after:border-primary after:rotate-180 after:-left-1 duration-300 group after:border-b-foreground',
				attr.className
			)}
		>
			<ChevronRightIcon className='w-5 h-5 transition-colors duration-300 group-hover:stroke-primary' />
		</span>
	);
};
