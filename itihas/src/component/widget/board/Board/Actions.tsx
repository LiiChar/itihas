import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
type Action = {
	element: ReactNode;
	action: () => void;
	alt?: string;
};

export const Actions = ({ actions }: { actions: Action[] }) => {
	return (
		<div className='flex absolute rounded-b-sm top-0 left-1/2 gap-2 justify-between items-center h-11 pt-[5px] px-2 bg-secondary'>
			{actions.map((a, i) => (
				<div key={i} onClick={a.action}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>{a.element}</TooltipTrigger>
							<TooltipContent>{a.alt}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
};
