import { socket } from '@/shared/lib/websocket/websocket';
import { useUserStore } from '@/shared/store/UserStore';
import { LikeHistory } from '@/shared/type/like';
import { useMount } from '@siberiacancode/reactuse';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

type HistoryLikeProps = {
	likes: LikeHistory[];
	historyId: number;
};

const generateLikesState = (likes: LikeHistory[]) => {
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

export const HistoryLike = ({ likes, historyId }: HistoryLikeProps) => {
	const [like, setLike] = useState(generateLikesState(likes ?? []));
	const { user } = useUserStore();

	useMount(() => {
		socket.on(
			'history_like_update',
			(data: { positiveLike: number; negativeLike: number }) => {
				setLike(data);
			}
		);
	});
	const handleLike = (variant: 'negative' | 'positive') => {
		if (!user && !historyId) return;
		socket.emit('history_like_add', {
			historyId: historyId,
			userId: user!.id,
			variant: variant,
		});
	};
	return (
		<div className='flex gap-2 w-full'>
			<div>{like.positiveLike}</div>
			<div>
				<ThumbsUp
					onClick={() => handleLike('positive')}
					height={18}
					width={18}
				/>
			</div>
			<div>{like.negativeLike}</div>
			<div>
				<ThumbsDown
					onClick={() => handleLike('negative')}
					height={18}
					width={18}
				/>
			</div>
		</div>
	);
};
