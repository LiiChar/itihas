import { runListener } from '@/shared/store/ListenerStore';

export const historyAddSocketHandler = (_data: any) => {};

export const historyAddLikeSocketHandler = (_data: any) => {};

export const historyAddCommentSocketHandle = () => {
	runListener('historyChange');
};
