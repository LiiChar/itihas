import { getPagesList } from '@/shared/api/page';
import { cn } from '@/shared/lib/lib';
import { PageWithHistory } from '@/shared/type/page';
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandItem,
} from '@/shared/ui/command';
import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';

export type PagesSearchProps = {
	historyId?: number;
	onSubmit: (history: PageWithHistory) => void;
	className?: React.HTMLAttributes<HTMLDivElement>['className'];
	option?: {
		listVisible?: boolean;
		closeSelect?: boolean;
	};
};

export const PageSearch = ({
	className,
	onSubmit,
	historyId,
	option,
}: PagesSearchProps) => {
	const [pages, setPages] = useState<PageWithHistory[]>([]);
	const [value, setValue] = useState('');
	const [visibleList, setVisibleList] = useState(option?.listVisible ?? true);
	useMount(() => {
		getPagesList(historyId).then(data => {
			setPages(data);
		});
	});

	const handleSelect = (history: PageWithHistory) => {
		onSubmit(history);
		setVisibleList(false);
		setValue(history.name);
	};

	return (
		<>
			{pages.length > 0 && (
				<Command className={className}>
					<CommandInput
						onInput={e => setValue(e.currentTarget.value)}
						value={value}
						onFocus={() => !option?.listVisible && setVisibleList(true)}
						placeholder='Введите название страницы'
					/>
					<CommandList
						className={cn(
							'transition-all',
							visibleList ? 'max-h-[250px]' : 'max-h-0'
						)}
					>
						<CommandEmpty>Подходящей страницы нет</CommandEmpty>
						{pages.map(h => (
							<CommandItem
								onSelect={() => handleSelect(h)}
								onClick={e => e.stopPropagation()}
							>
								{h.name}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			)}
		</>
	);
};
