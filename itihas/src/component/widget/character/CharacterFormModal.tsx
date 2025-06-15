import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { ReactNode } from 'react';
import { Character } from '@/shared/type/character';
import { UpdateCharacterForm } from './CharacterFormUpdate';
import { CreateCharacterForm } from './CharacterFormCreate';

type CharacterFormModalProps = {
	onSubmit?: (page: Character) => void;
	children?: ReactNode;
	type?: 'update' | 'create';
	data?: Partial<Character>;
};
const getTypeModal = (data: CharacterFormModalProps) => {
	const typeForm = {
		update: <UpdateCharacterForm onSubmit={data.onSubmit} data={data.data} />,
		create: <CreateCharacterForm onSubmit={data.onSubmit} data={data.data} />,
	};

	return typeForm[data.type!];
};

export const CharacterFormModal = ({
	onSubmit,
	children,
	type = 'create',
	data,
}: CharacterFormModalProps) => {
	return (
		<Dialog>
			<DialogTrigger className='w-min h-min'>{children}</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				{getTypeModal({ onSubmit, children, type, data })}
			</DialogContent>
		</Dialog>
	);
};
