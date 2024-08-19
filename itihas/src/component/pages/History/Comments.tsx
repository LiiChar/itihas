import { memo } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { Textarea } from '@material-tailwind/react';
import { Comment } from './Comment';

export const Comments = memo(
	({ comments }: { comments: CommentWithUser[] }) => {
		return (
			<div>
				<h3>Комментарии</h3>
				<Textarea
					className='auto  rounded-lg'
					placeholder='Оставить комментарий'
				/>
				<div className='flex flex-col gap-4 mt-3'>
					{comments.map(c => (
						<Comment key={c.id} comment={c} />
					))}
				</div>
			</div>
		);
	}
);
