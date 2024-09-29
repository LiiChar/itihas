import { memo } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { Comment } from './Comment';
import { TextareaForm } from '@/component/widget/form/TextareaForm';
import { createComment } from '@/shared/api/comment';
import { setHistory, useHistoryStore } from '@/shared/store/HistoryStore';
import { useUserStore } from '@/shared/store/UserStore';
import { getHistory } from '@/shared/api/history';

export const CommentTextarea = memo(() => {
	return (
		<TextareaForm
			placeholder='Написть комментарии'
			onSubmit={value => {
				const id = useHistoryStore.getState().history?.id;
				const userId = useUserStore.getState().user?.id;
				if (!id || !userId) return;
				createComment({
					content: value,
					historyId: id,
					userId: userId,
				}).then(async () => {
					const history = await getHistory(id);
					setHistory(history);
				});
			}}
		/>
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
				</div>
			</div>
		);
	}
);
