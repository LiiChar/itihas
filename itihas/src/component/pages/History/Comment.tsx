import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
	CommentLike,
	CommentReplyWithUser,
	CommentWithUser,
} from '../../../shared/type/comment';
import { getTimeAgo } from '../../../shared/lib/time';
import { getFullUrl } from '../../../shared/lib/image';
import { Button } from '@/shared/ui/button';
import { Heart, ReplyIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useUserStore } from '@/shared/store/UserStore';
import { useMount } from '@siberiacancode/reactuse';
import { socket } from '@/shared/lib/websocket/websocket';
import { TextareaForm } from '@/component/widget/form/TextareaForm';
import { createReplyComment, getReplyComment } from '@/shared/api/comment';
import { ReplyComment } from './ReplyComment';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/lib/lib';
import { useNavigate, useNavigation } from 'react-router-dom';

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

export const Comment = memo(
	({ comment }: { comment: CommentReplyWithUser }) => {
		return (
			<article className='w-full overflow-hidden flex gap-2' key={comment.id}>
				<ReplyComment comment={comment} />
			</article>
		);
	}
);
