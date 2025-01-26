import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { EditPageForm } from './EditPageForm';
import { HistoryPage } from '@/shared/type/history';
import { ReactNode } from 'react';

export const EditPageModal = ({
	page,
	children,
}: {
	page: HistoryPage;
	children?: ReactNode;
}) => {
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Изменить страницу</DialogTitle>
				</DialogHeader>
				<EditPageForm page={page} />
			</DialogContent>
		</Dialog>
	);
};
