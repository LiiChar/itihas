import { ReadLayout } from '@/page/Read';
import { getCurrentPage } from '@/shared/api/page';
import { ReadPage } from '@/shared/type/page';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ReadLayoutModal = ({
	historyId,
	pageId,
}: {
	historyId: number;
	pageId: number;
}) => {
	const [page, setPage] = useState<ReadPage | null>(null);
	useEffect(() => {
		getCurrentPage(historyId, pageId).then(data => {
			setPage(data);
		});
	}, []);
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant={'ghost'} className='p-0' loading={!page}>
					<Play />
				</Button>
			</DialogTrigger>
			<DialogContent className='h-[80vh]'>
				{page && <ReadLayout page={page} />}
			</DialogContent>
		</Dialog>
	);
};
