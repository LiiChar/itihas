import { memo, useState } from 'react';
import { CommentLike, CommentWithUser } from '../../../shared/type/comment';
import { getTimeAgo } from '../../../shared/lib/time';
import { getFullUrl } from '../../../shared/lib/image';
import { Button } from '@/shared/ui/button';
import { ReplyIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';
import { socket } from '@/shared/lib/websocket/websocket';

const generateLikesState = (likes: CommentLike[]) => {
	const like = likes.reduce<{
		positiveLike: number;
		negativeLike: number;
	}>(
		(acc, like) => {
			if (like.variant == 'positive') {
				acc.positiveLike++;
			} else {
				acc.negativeLike++;
			}
			return acc;
		},
		{ positiveLike: 0, negativeLike: 0 }
	);
	return like;
};

export const Comment = memo(({ comment }: { comment: CommentWithUser }) => {
	const { user } = useUserStore();
	const [like, setLike] = useState(generateLikesState(comment.likes ?? []));

	useMount(() => {
		if (!user) return;

		socket.on(
			'comment_like_update',
			(data: { positiveLike: number; negativeLike: number }) => {
				setLike(data);
			}
		);
	});
	const handleLike = (variant: 'negative' | 'positive') => {
		if (!user && !comment.id) return;
		socket.emit('comment_like_add', {
			commentId: comment.id,
			userId: user!.id,
			variant: variant,
		});
	};

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
				<div className='bg-secondary px-2 py-1 rounded-lg  transition-all'>
					<div>
						<div className='font-bold'>{comment.user.name}</div>
						<div>{comment.user.dignity}</div>
					</div>
					<div>
						<div
							className={
								!visible && comment.content.length > 200 ? 'line-clamp-3' : ''
							}
						>
							{comment.content}
						</div>
						{comment.content.length > 200 && (
							<Button
								className='font-normal text-primary normal-case p-0 m-0 h-min'
								variant='ghost'
								onClick={() => setVisible(prev => !prev)}
							>
								{visible ? 'Скрыть' : 'Открыть'}
							</Button>
						)}
					</div>
				</div>
				<div className='flex justify-between mt-1 ml-2 items-center'>
					<div className='flex gap-3 items-center'>
						<div className='flex gap-2 items-center'>
							<div>
								<ThumbsUp
									onClick={() => handleLike('positive')}
									height={18}
									width={18}
								/>
							</div>
							<div>{like.positiveLike - like.negativeLike}</div>
							<div>
								<ThumbsDown
									onClick={() => handleLike('negative')}
									height={18}
									width={18}
								/>
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
