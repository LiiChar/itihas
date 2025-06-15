import { Battle, BattleParticipant, BattleResult } from './battle';
import { History } from './history';
import { User } from './user';

export type Character = {
	id: number;
	rarity:
		| 'handmade'
		| 'common'
		| 'uncommon'
		| 'rare'
		| 'epic'
		| 'legendary'
		| 'mythic'
		| 'transcendent'
		| null;
	name: string;
	health: number;
	armor: number;
	attack: number;
	image: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	historyId: number;
	authorId?: number;
	rank: number;
};

export type Dignity = {
	id: number;
	rarity:
		| 'handmade'
		| 'common'
		| 'uncommon'
		| 'rare'
		| 'epic'
		| 'legendary'
		| 'mythic'
		| 'transcendent';
	name: string;
	description: string | null;
	createdAt: string;
};

export type CharacterToUser = {
	id: number;
	userId: number;
	characterId: number;
};

export type UserCharacter = CharacterToUser & {
	character: CharacterRelation;
};

export type CharacterRelation = Character & {
	history: History;
};

export type CharacterInsert = {
	name: string;
	rarity?:
		| 'handmade'
		| 'common'
		| 'uncommon'
		| 'rare'
		| 'epic'
		| 'legendary'
		| 'mythic'
		| 'transcendent'
		| null;
	rank?: number | null;
	image?: string | null;
	description?: string | null;
	historyId: number;
	authorId?: number | null;
};

export type CharacterAll = Character & {
	battleResults: (BattleResult & {
		battle: Battle & {
			participants: BattleParticipant[];
		};
		character: Character;
	})[];
	users: {
		user: User;
	}[];
	history: History;
	user: User;
};
