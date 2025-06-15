import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { HistoryPage } from '@/shared/type/history';
import { CreatePageForm } from './CreatePageForm';
import { ReactNode } from 'react';

export const CreatePageModal = ({
	onCreate,
	children,
}: {
	onCreate: (page: HistoryPage) => void;
	children?: ReactNode;
}) => {
	return (
		<Dialog>
			<DialogTrigger className='w-min h-min'>{children}</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Создать содержание</DialogTitle>
				</DialogHeader>
				<CreatePageForm onCreate={onCreate} />
			</DialogContent>
		</Dialog>
	);
};
