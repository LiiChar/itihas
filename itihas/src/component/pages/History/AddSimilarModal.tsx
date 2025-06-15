import { addSimilarHistory, getHistories } from '@/shared/api/history';
import { History } from '@/shared/type/history';
import { Button } from '@/shared/ui/button';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/shared/ui/command';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';

export const AddSimilarModal = ({
	historyId,
	onSubmit,
}: {
	historyId: number;
	onSubmit: () => void;
}) => {
	const [histories, setHistories] = useState<History[]>([]);

	useMount(() => {
		getHistories().then(data => {
			setHistories(data);
		});
	});

	const handleSimilar = (similarId: number) => {
		addSimilarHistory({
			historyId: historyId,
			similarHistoryId: similarId,
		}).then(() => {
			onSubmit();
		});
	};
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant='link' className='font-normal text-primary normal-case'>
					Добавить
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-transparent border-none'>
				<Command>
					<CommandInput placeholder='Введите название истории' />
					<CommandList>
						<CommandEmpty>Подходящей истории нет</CommandEmpty>
						{histories.map(h => (
							<CommandItem
								key={h.id}
								onSelect={() => {
									handleSimilar(h.id);
								}}
							>
								{h.name}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
};
