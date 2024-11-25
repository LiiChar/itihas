import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { Pencil } from 'lucide-react';
import { UpdatePointPageForm } from './UpdatePointPageForm';
import { PagePointInsert } from '@/shared/type/page';
import { PointPage } from '@/shared/type/point';

export const UpdatePointPageModal = ({
	onCreate,
	action,
	pagesName,
}: {
	onCreate: (page: Partial<PagePointInsert>) => void;
	action: PointPage;
	pagesName?: { id: number; name: string }[];
}) => {
	return (
		<Dialog>
			<DialogTrigger>
				<Pencil className='cursor-pointer' height={11} />
			</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Создать содержание</DialogTitle>
				</DialogHeader>
				<UpdatePointPageForm
					pagesName={pagesName}
					action={action}
					onCreate={onCreate}
				/>
			</DialogContent>
		</Dialog>
	);
};
