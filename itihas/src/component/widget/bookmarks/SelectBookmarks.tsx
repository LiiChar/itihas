import {
	addHistoryToBookmark,
	deleteBookmark,
	getListBookmarks,
} from '@/shared/api/history';
import { useUserStore } from '@/shared/store/UserStore';
import { Bookmark } from '@/shared/type/bookmark';
import { useQuery } from '@siberiacancode/reactuse';
import { ReactNode, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { cn } from '@/shared/lib/lib';

type SelectBookmarksProps = {
	children?: ReactNode | undefined;
	historyId: number;
	inBookmark?: null | number;
};

export const SelectBookmarks = ({
	children,
	historyId,
	inBookmark = null,
}: SelectBookmarksProps) => {
	const { user } = useUserStore();
	const [visible, setVisible] = useState(false);
	const { runListener } = useListenerStore();
	if (!user) {
		return '';
	}
	const { data } = useQuery(() => getListBookmarks(user.id), {
		initialData: [] as Bookmark[],
	});

	const handleSelectBookmark = async (bookmarkId: number) => {
		await addHistoryToBookmark({ historyId, bookmarkId });
		setVisible(false);
		runListener('historyChange');
	};

	const removeBookmark = async () => {
		if (!inBookmark) return;
		await deleteBookmark(inBookmark);
		setVisible(false);
		runListener('historyChange');
	};

	console.log(inBookmark, data);

	return (
		<Popover open={visible} onOpenChange={e => setVisible(e)}>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<ul>
					{data &&
						Array.isArray(data) &&
						data.map(b => (
							<li
								className={cn(
									'py-1 text-sm cursor-pointer',
									inBookmark == b.id ? 'bg-primary' : ''
								)}
								onClick={() => handleSelectBookmark(b.id)}
								key={b.id}
							>
								{b.name}
							</li>
						))}
					{inBookmark && (
						<li
							className='py-1 text-sm text-destructive cursor-pointer'
							onClick={() => removeBookmark()}
						>
							Удалить из закладок
						</li>
					)}
				</ul>
			</PopoverContent>
		</Popover>
	);
};
