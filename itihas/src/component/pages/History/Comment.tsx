import { memo, useState } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { getTimeAgo } from '../../../shared/lib/time';
import { getFullUrl } from '../../../shared/lib/image';
import { Button } from '@/shared/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export const Comment = memo(({ comment }: { comment: CommentWithUser }) => {
	const [visible, setVisible] = useState(comment.content.length < 270);
	return (
		<article className='flex gap-1' key={comment.id}>
			<Avatar className='w-10 h-10'>
				<AvatarImage
					alt={`Фотография пользователя ${comment.user.name}`}
					src={getFullUrl(comment.user.photo)}
				/>
				<AvatarFallback>{comment.user.name}</AvatarFallback>
			</Avatar>
			<div>
				<div className='bg-secondary px-2 py-1 rounded-lg '>
					<div>
						<div>{comment.user.name}</div>
						<div>{comment.user.dignity}</div>
					</div>
					<div>
						<div className={!visible ? 'line-clamp-3' : ''}>
							{comment.content}
						</div>
						<Button
							className='font-normal text-primary normal-case p-0 m-0 h-min'
							variant='ghost'
							onClick={() => setVisible(prev => !prev)}
						>
							{visible ? 'Скрыть' : 'Открыть'}
						</Button>
					</div>
				</div>
				<div className='flex justify-between items-center'>
					<div className='flex gap-2'>
						<div className='flex gap-1'>
							<div>
								<ThumbsUp />
							</div>
							<div>{comment.rate ?? 0}</div>
							<div>
								<ThumbsDown />
							</div>
						</div>
						<div>L</div>
						<div>C</div>
					</div>
					<div className='text-xs'>{getTimeAgo(comment.updatedAt)}</div>
				</div>
			</div>
		</article>
	);
});
