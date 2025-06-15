import { createBookmark } from '@/shared/api/history';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';

export const BookmarkCreateForm = memo(() => {
	const [name, setName] = useState('');
	const [visible, setVisible] = useState(false);
	const { user } = useUserStore();
	const { id } = useParams();
	const { runListener } = useListenerStore();

	const handleBookmarkCreateForm = async () => {
		let uId = user?.id;
		if (id) {
			uId = Number(id);
		}
		await createBookmark({ name, userId: uId });
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
