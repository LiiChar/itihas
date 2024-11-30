import { addHistoryToBookmark, getListBookmarks } from '@/shared/api/history';
import { useUserStore } from '@/shared/store/UserStore';
import { Bookmark } from '@/shared/type/bookmark';
import { useQuery } from '@siberiacancode/reactuse';
import { ReactNode, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

type SelectBookmarksProps = {
	children?: ReactNode | undefined;
	historyId: number;
};

export const SelectBookmarks = ({
	children,
	historyId,
}: SelectBookmarksProps) => {
	const { user } = useUserStore();
	const [visible, setVisible] = useState(false);
	if (!user) {
		return '';
	}
	const { data } = useQuery(() => getListBookmarks(user.id), {
		initialData: [] as Bookmark[],
	});

	const handleSelectBookmark = (bookmarkId: number) => {
		addHistoryToBookmark({ historyId, bookmarkId });
		setVisible(false);
	};

	return (
		<Popover open={visible} onOpenChange={e => setVisible(e)}>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<ul>
					{data &&
						Array.isArray(data) &&
						data.map((b, _i) => (
							<li
								className='py-1 text-sm'
								onClick={() => handleSelectBookmark(b.id)}
								key={b.id}
							>
								{b.name}
							</li>
						))}
				</ul>
			</PopoverContent>
		</Popover>
	);
};
