import { memo } from 'react';
import { CommentReplyWithUser } from '../../../shared/type/comment';

import { ReplyComment } from './ReplyComment';

export const Comment = memo(
	({ comment }: { comment: CommentReplyWithUser & any }) => {
		return (
			<article className='w-full overflow-hidden flex gap-2' key={comment.id}>
				<ReplyComment comment={comment} />
			</article>
		);
	}
);
