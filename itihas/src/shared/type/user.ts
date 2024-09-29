import { BookmarkWithHistories } from './bookmark';
import { Dignity, UserCharacter } from './character';
import { Comment } from './comment';
import { HistoryAll } from './history';
import { LikeWithPage } from './like';

export type User = {
	id: number;
	name: string;
	photo: string;
	description: string | null;
	createdAt: string;
	verify: boolean;
	location: string | null;
	age: number | null;
	role: 'user' | 'admin';
	email: string | null;
	dignity:
		| 'handmade'
		| 'common'
		| 'uncommon'
		| 'rare'
		| 'epic'
		| 'legendary'
		| 'mythic'
		| 'transcendent';
	dignityId: number;
};

export type UserAll = User & {
	authorHistories: HistoryAll[];
	bookmarks: BookmarkWithHistories[];
	characters: UserCharacter[];
	comments: Comment[];
	commentsReply: Comment[];
	dignity: Dignity;
	likes: LikeWithPage[];
};
