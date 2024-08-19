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
