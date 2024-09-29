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
	image: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	historyId: number;
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
