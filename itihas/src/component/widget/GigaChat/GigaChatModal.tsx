import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { Bot } from 'lucide-react';
import { GigaChat } from './GigaChat';

export const GigaChatModal = () => {
	return (
		<Dialog>
			<DialogTrigger className='w-min h-min'>
				<Bot />
			</DialogTrigger>
			<DialogContent
				className=' h-[80vh] '
				onMouseDown={e => e.stopPropagation()}
			>
				<DialogTitle className='hidden'></DialogTitle>
				<div className='h-full overflow-auto'>
					<GigaChat />
				</div>
			</DialogContent>
		</Dialog>
	);
};
