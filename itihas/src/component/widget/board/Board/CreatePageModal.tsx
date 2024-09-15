import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { HistoryPage } from '@/shared/type/history';
import { CreatePageForm } from './CreatePageForm';
import { PlusSquare } from 'lucide-react';

export const CreatePageModal = ({
	onCreate,
}: {
	onCreate: (page: HistoryPage) => void;
}) => {
	return (
		<Dialog>
			<DialogTrigger>
				<PlusSquare />
			</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Создать содержание</DialogTitle>
				</DialogHeader>
				<CreatePageForm onCreate={onCreate} />
			</DialogContent>
		</Dialog>
	);
};
