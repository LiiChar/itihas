import { Character } from './character';
import { User } from './user';

// Типы данных
export interface Battle {
	id: number;
	name: string;
	startedAt: string;
	status: 'started' | 'finished' | 'initialized';
	endedAt: string | null;
	updatedAt: string;
}

export type BattleParticipants = Battle & {
	participants: BattleParticipant[];
};

export interface BattleAll extends BattleParticipants {
	results: BattleResult;
}

export interface BattleParticipant {
	id: number;
	battleId: number;
	characterId: number;
	userId: number;
	team?: string;
	createdAt: string;
	character: Character;
	user: User;
}

export interface BattleResult {
	id: number;
	battle: BattleParticipants;
	battleId: number;
	log: string;
	result: string;
	status: 'complate' | 'reject' | 'draw' | 'failed';
	createdAt: string;
}

export type ResultJsonType = {
	participantId: number;
	status: 'win' | 'lose' | 'draw';
};
