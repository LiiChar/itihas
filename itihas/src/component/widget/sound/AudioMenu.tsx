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
				<DropdownMenuTrigger className='fixed top-2 left-1'>
					<LucideVolume2 />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<SoundBar />
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
});
