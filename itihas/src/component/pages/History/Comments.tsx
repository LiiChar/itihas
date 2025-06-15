import { memo, useState } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { Comment } from './Comment';

import ReactMarkdown from 'react-markdown';
import { createComment } from '@/shared/api/comment';
import { useHistoryStore } from '@/shared/store/HistoryStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Textarea } from '@/shared/ui/textarea';
import { MarkdownEditor } from '@/shared/ui/markdown-editor';
import { ReplyComment } from './ReplyComment';

export const CommentTextarea = memo(() => {
	const { user } = useUserStore();
	const historyId = useHistoryStore(store => store.history?.id);

	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);

	if (!user) return null;

	const handleSubmit = async (text: string) => {
		if (!text.trim()) return;

		setLoading(true);
		try {
			await createComment({
				content: text,
				historyId: historyId!,
				userId: user.id,
			});
			setValue('');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<MarkdownEditor
			value={value}
			onChange={e => setValue(e.toString())}
			onSubmit={e => handleSubmit(e.toString())}
			disabled={loading}
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
						<ReplyComment comment={c as any} />
					))}
					{comments.length == 0 && (
						<div>Тут пусто, но ты можешь это исправить</div>
					)}
				</div>
			</div>
		);
	}
);
