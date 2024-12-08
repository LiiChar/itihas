import { memo, useState } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { Comment } from './Comment';
import { TextareaForm } from '@/component/widget/form/TextareaForm';
import { createComment } from '@/shared/api/comment';
import { useHistoryStore } from '@/shared/store/HistoryStore';
import { useUserStore } from '@/shared/store/UserStore';

export const CommentTextarea = memo(() => {
	const { user } = useUserStore();
	const [text, setText] = useState('');
	if (!user) {
		return '';
	}
	return (
		<div>
			<TextareaForm
				placeholder='Написть комментарии'
				onSubmit={value => {
					const id = useHistoryStore.getState().history?.id;
					const userId = user.id;
					if (!value) {
						setText('Введите комментарий');
						return;
					}
					if (value.length < 3) {
						setText('Комментарий должен быть более 3 симоволов');
						return;
					}
					if (!id || !userId) return;
					createComment({
						content: value,
						historyId: id,
						userId: userId,
					});
				}}
			/>
			<div className='text-sm'>{text}</div>
		</div>
	);
});

export const Comments = memo(
	({ comments }: { comments: CommentWithUser[] }) => {
		return (
			<div>
				<h3>Комментарии</h3>
				<CommentTextarea />
				<div className='flex flex-col gap-4 mt-3'>
					{comments.map(c => (
						<Comment key={c.id} comment={c} />
					))}
					{comments.length == 0 && (
						<div>Тут пусто, но ты можешь это исправить</div>
					)}
				</div>
			</div>
		);
	}
);
