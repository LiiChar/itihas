import { getHistories } from '@/shared/api/history';
import { History } from '@/shared/type/history';
import { useMount } from '@siberiacancode/reactuse';
import { CommandInput, CommandList, CommandEmpty, CommandItem } from 'cmdk';
import { Command } from 'lucide-react';
import { useState } from 'react';

export type HistorySearchProps = {
	className: React.HTMLAttributes<HTMLDivElement>;
	onSubmit: (history: History) => void;
};

export const HistorySearch = ({ className, onSubmit }: HistorySearchProps) => {
	const [histories, setHistories] = useState<History[]>([]);

	useMount(() => {
		getHistories().then(data => {
			setHistories(data);
		});
	});
	return (
		<Command className={className as string}>
			<CommandInput placeholder='Введите название истории' />
			<CommandList>
				<CommandEmpty>Подходящей истории нет</CommandEmpty>
				{histories.map(h => (
					<CommandItem
						onSelect={() => {
							onSubmit(h);
						}}
					>
						{h.name}
					</CommandItem>
				))}
			</CommandList>
		</Command>
	);
};
