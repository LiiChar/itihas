import { socket } from '@/shared/lib/websocket/websocket';
import { useUserStore } from '@/shared/store/UserStore';
import { LikeHistory } from '@/shared/type/like';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { useMount } from '@siberiacancode/reactuse';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type HistoryLikeProps = {
	likes: LikeHistory[];
	historyId: number;
};

const getLike = (likes: LikeHistory[]): number => {
	if (likes.length == 0) return 0;
	const accLike = likes.reduce<number>((acc, l) => acc + l.value, 0);
	return accLike / likes.length;
};

export const HistoryLike = ({ likes, historyId }: HistoryLikeProps) => {
	const [like, setLike] = useState(getLike(likes ?? []));
	const likeRef = useRef<HTMLDivElement>(null);
	const { user } = useUserStore();
	const [selectLike, setSelectLike] = useState<number | null>(null);
	const [isSelect, setIsSelect] = useState<boolean>(false);

	useMount(() => {
		socket.on(
			'history_like_update',
			(data: { userId: number; historyId: number; like: number }) => {
				setLike(data.like);
			}
		);
	});

	const handleLikeMouse = (e: MouseEvent) => {
		setSelectLike(e.layerX / 20);
	};

	useEffect(() => {
		likeRef.current?.addEventListener('mouseover', handleLikeMouse);

		return () => {
			likeRef.current?.removeEventListener('mouseover', handleLikeMouse);
		};
	}, [likeRef]);

	const handleLike = () => {
		if (!isSelect) return;
		if (!user) {
			toast('Вы не зарегестрированы');
			return;
		}
		if (!historyId) {
			toast('Произошла ошибка, попробујте позже');
			return;
		}
		socket.emit('history_like_add', {
			historyId: historyId,
			userId: user.id,
			value: selectLike,
		});
		setIsSelect(false);
	};
	return (
		<Tooltip>
			<TooltipTrigger>
				<div
					className='relative '
					ref={likeRef}
					onMouseDown={() => {
						setIsSelect(true);
					}}
					onMouseUp={handleLike}
				>
					<div
						className='w-[110px] h-[30px] overflow-hidden	 '
						style={{
							maxWidth:
								20 * (selectLike && isSelect ? selectLike : like) + 'px',
						}}
					>
						<div className=' h-[30px] flex '>
							<Star className='fill-primary stroke-none min-w-[20px] w-[20px] ' />
							<Star className='fill-primary stroke-none min-w-[20px] w-[20px] ' />
							<Star className='fill-primary stroke-none min-w-[20px] w-[20px] ' />
							<Star className='fill-primary stroke-none min-w-[20px] w-[20px] ' />
							<Star className='fill-primary stroke-none min-w-[20px] w-[20px] ' />
						</div>
					</div>

					<div className=' h-[30px] flex absolute w-full top-0 left-0'>
						<Star className='fill-none stroke-primary min-w-[20px] w-[20px]' />
						<Star className='fill-none stroke-primary min-w-[20px] w-[20px]' />
						<Star className='fill-none stroke-primary min-w-[20px] w-[20px]' />
						<Star className='fill-none stroke-primary min-w-[20px] w-[20px]' />
						<Star className='fill-none stroke-primary min-w-[20px] w-[20px]' />
					</div>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				Средняя оценка: {like}, основанная на {likes.length + 1} отзывах
			</TooltipContent>
		</Tooltip>
	);
};
