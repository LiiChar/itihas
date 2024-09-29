import { memo, useState } from 'react';
import { CommentWithUser } from '../../../shared/type/comment';
import { getTimeAgo } from '../../../shared/lib/time';
import { getFullUrl } from '../../../shared/lib/image';
import { Button } from '@/shared/ui/button';
import { ReplyIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export const Comment = memo(({ comment }: { comment: CommentWithUser }) => {
	const [visible, setVisible] = useState(comment.content.length < 270);
	return (
		<article className='w-full flex gap-2' key={comment.id}>
			<Avatar className='w-9 h-9 mt-1'>
				<AvatarImage
					alt={`Фотография пользователя ${comment.user.name}`}
					src={getFullUrl(comment.user.photo)}
				/>
				<AvatarFallback>{comment.user.name}</AvatarFallback>
			</Avatar>
			<div className='w-full'>
				<div className='bg-secondary px-2 py-1 rounded-lg '>
					<div>
						<div className='font-bold'>{comment.user.name}</div>
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
				<div className='flex justify-between mt-1 ml-2 items-center'>
					<div className='flex gap-3 items-center'>
						<div className='flex gap-2 items-center'>
							<div>
								<ThumbsUp height={18} width={18} />
							</div>
							<div>{comment.rate ?? 0}</div>
							<div>
								<ThumbsDown height={18} width={18} />
							</div>
						</div>
						<div>
							<ReplyIcon height={18} width={18} />
						</div>
					</div>
					<div className='text-xs'>{getTimeAgo(comment.updatedAt)}</div>
				</div>
			</div>
		</article>
	);
});
