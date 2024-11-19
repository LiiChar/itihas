import { createBookmark } from '@/shared/api/history';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { memo, useState } from 'react';

export const BookmarkCreateForm = memo(() => {
	const [name, setName] = useState('');
	const [visible, setVisible] = useState(false);
	const { isAuthorize, user } = useUserStore();
	const { runListener } = useListenerStore();

	const handleBookmarkCreateForm = async () => {
		await createBookmark({ name, userId: user?.id });
		runListener('userChange');
	};

	return (
		<Dialog
			open={visible}
			onOpenChange={opened => {
				setVisible(opened);
			}}
		>
			<DialogTrigger className='h-6 flex justify-center items-center bg-primary px-2 rounded-sm text-background'>
				+
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Добавить закладку</DialogTitle>
				</DialogHeader>
				<Input value={name} onInput={e => setName(e.currentTarget.value)} />
				<Button onClick={handleBookmarkCreateForm}>Добавить</Button>
			</DialogContent>
		</Dialog>
	);
});
