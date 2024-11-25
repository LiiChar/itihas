import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { PlusSquare } from 'lucide-react';
import { CreatePointPageForm } from './CreatePointPageForm';

export const CreatePointPageModal = ({ pageId }: { pageId: number }) => {
	return (
		<Dialog>
			<DialogTrigger>
				<PlusSquare width={16} />
			</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Создать поинт</DialogTitle>
				</DialogHeader>
				<CreatePointPageForm pageId={pageId} />
			</DialogContent>
		</Dialog>
	);
};
