import { LucideVolume2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';
import { memo } from 'react';
import { SoundBar } from './SoundBar';

export const AudioMenu = memo(() => {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className='fixed top-3 left-3'>
					<LucideVolume2 className='hover:stroke-primary' />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<SoundBar />
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
});
