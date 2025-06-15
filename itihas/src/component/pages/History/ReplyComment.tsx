import { memo, useState } from 'react';
import {
	CommentLike,
	CommentReplyWithUser,
} from '../../../shared/type/comment';
import { getTimeAgo } from '../../../shared/lib/time';
import { getFullUrl } from '../../../shared/lib/image';
import { Button } from '@/shared/ui/button';
import { Heart, ReplyIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';
import { socket } from '@/shared/lib/websocket/websocket';
import { createReplyComment, getReplyComment } from '@/shared/api/comment';
import { MarkdownEditor } from '@/shared/ui/markdown-editor';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { toast } from 'sonner';

const fetchReplyComments = async (commentId: number) => {
	return await getReplyComment(commentId);
};

const getOwnLike = (likes: CommentLike[], userId?: number) => {
	if (!userId) {
		return 0;
	}
	const like = likes.find(l => l.userId == userId);

	if (!like) {
		return 0;
	}

	return like.variant == 'positive' ? 1 : -1;
};

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

export const ReplyComment = memo(
	({ comment }: { comment: CommentReplyWithUser }) => {
		const { user } = useUserStore();
		const [visibleReplyInput, setVisibleReplyInput] = useState(false);
		const [visibleReplyComments, setVisibleReplyComments] = useState(false);
		const [replyComments, setReplyComments] = useState<
			CommentReplyWithUser[] | null
		>(null);
		const [visible, setVisible] = useState(comment.content.length < 270);
		const [like, setLike] = useState(generateLikesState(comment.likes ?? []));
		const [ownLike, setOwnLike] = useState(
			getOwnLike(comment.likes ?? [], user?.id ?? undefined)
		);

		useMount(() => {
			fetchReplyComments(comment.id).then(setReplyComments);
			socket.on(
				'comment_like_update',
				(data: {
					positiveLike: number;
					negativeLike: number;
					commentId: number;
					userId: number;
					variant: 'positive' | 'negative';
				}) => {
					if (data.commentId == comment.id) {
						setLike(data);
					}
				}
			);
		});

		const handleReply = async (content: string) => {
			await createReplyComment({
				commentId: comment.id,
				userId: user!.id,
				content,
			});
			fetchReplyComments(comment.id).then(setReplyComments);
		};

		const handleLike = (variant: 'negative' | 'positive') => {
			if (!user && !comment.id) return;

			setOwnLike(prev => (prev == 0 ? 1 : 0));

			socket.emit('comment_like_add', {
				commentId: comment.id,
				userId: user!.id,
				variant: variant,
			});
		};

		return (
			<motion.article
				className='w-full flex gap-2'
				key={comment.id}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.2 }}
			>
				<Avatar className='w-9 h-9 mt-1'>
					<AvatarImage
						alt={`Фотография пользователя ${comment.user.name}`}
						src={getFullUrl(comment.user.photo)}
					/>
					<AvatarFallback>{comment.user.name}</AvatarFallback>
				</Avatar>

				<div className='w-full'>
					<div className='bg-secondary px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-all'>
						<div className='mb-1'>
							<div className='font-semibold text-sm'>{comment.user.name}</div>
							<div className='text-xs text-muted-foreground'>
								{comment.user.dignity}
							</div>
						</div>

						<div className='text-sm leading-relaxed markdown'>
							<div
								className={
									!visible && comment.content.length > 200 ? 'line-clamp-3' : ''
								}
							>
								<Markdown>{comment.content}</Markdown>
							</div>
							{comment.content.length > 200 && (
								<Button
									className='text-xs font-medium text-primary px-0 h-auto mt-1'
									variant='ghost'
									onClick={() => setVisible(prev => !prev)}
								>
									{visible ? 'Скрыть' : 'Показать полностью'}
								</Button>
							)}
						</div>
					</div>

					<div className='flex justify-between mt-1 ml-0 items-center'>
						<div className='flex gap-1 items-center text-xs text-muted-foreground'>
							<div className='flex gap-1 items-center'>
								<div>
									<Heart
										onClick={() => {
											if (user) {
												handleLike('positive');
											} else {
												toast('Авторизуйтесь для добавления реакций');
											}
										}}
										height={18}
										width={18}
										className={ownLike == 1 ? 'fill-green-500' : ''}
									/>
									{/* <ThumbsUp
										onClick={() => handleLike('positive')}
										height={18}
										width={18}
										className={${ownLike == 1 ? 'fill-green-500' : ''}}
									/> */}
								</div>
								<div>{like.positiveLike - like.negativeLike}</div>
								{/* <div>
									<ThumbsDown
										onClick={() => handleLike('negative')}
										height={18}
										width={18}
										className={${ownLike == -1 ? 'fill-red-500' : ''}}
									/>
								</div> */}
							</div>
							{user && (
								<Button
									onClick={() => setVisibleReplyInput(prev => !prev)}
									variant='ghost'
									className='p-[10px] h-full hover:bg-accent rounded-full'
								>
									<ReplyIcon
										className={`transition-transform ${
											visibleReplyInput ? 'rotate-180 text-primary' : ''
										}`}
										size={16}
									/>
								</Button>
							)}
							<Button
								onClick={() =>
									replyComments &&
									replyComments.length > 0 &&
									setVisibleReplyComments(prev => !prev)
								}
								className={`text-xs rounded-2xl px-2 ${
									visibleReplyComments ? 'text-primary' : ''
								}`}
								loading={replyComments == null}
								variant='ghost'
								disabled={!(replyComments && replyComments.length > 0)}
							>
								Ответы ({replyComments?.length || 0})
							</Button>
						</div>
						<div className='text-[10px] text-muted-foreground'>
							{getTimeAgo(comment.updatedAt)}
						</div>
					</div>

					<AnimatePresence>
						{visibleReplyInput && user && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.2 }}
								className='overflow-x-hidden mt-2'
							>
								<MarkdownEditor onSubmit={e => handleReply(e.toString())} />
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{visibleReplyComments && replyComments && (
							<motion.div
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.2 }}
								className='mt-2 space-y-2'
							>
								{replyComments.map(r => (
									<ReplyComment key={r.id} comment={r} />
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.article>
		);
	}
);
