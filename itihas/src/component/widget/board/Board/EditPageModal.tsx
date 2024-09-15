import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { EditPageForm } from './EditPageForm';
import { Edit } from 'lucide-react';
import { HistoryPage } from '@/shared/type/history';

export const EditPageModal = ({ page }: { page: HistoryPage }) => {
	return (
		<Dialog>
			<DialogTrigger>
				<Edit width={16} className='cursor-pointer' />
			</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Изменить страницу</DialogTitle>
				</DialogHeader>
				<EditPageForm page={page} />
			</DialogContent>
		</Dialog>
	);
};
