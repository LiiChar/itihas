import { eq } from 'drizzle-orm';
import { ReasonPhrases } from 'http-status-codes';
import {
	BattleParticipantsInsertType,
	BattleResultInsertType,
	db,
} from '../../database/db';
import { ErrorBoundary } from '../../lib/error';
import { battles, battleParticipants, battleResults } from './model/character';

// Создание сражения
export const createBattle = async (name: string) => {
	const newBattle = await db
		.insert(battles)
		.values({ name, status: 'initialized' })
		.returning();
	return newBattle[0];
};

// Обновление сражения
export const updateBattle = async (
	battleId: number,
	data: Partial<BattleParticipantsInsertType>
) => {
	const updatedBattle = await db
		.update(battles)
		.set(data)
		.where(eq(battles.id, battleId))
		.returning();

	if (!updatedBattle.length) {
		throw new ErrorBoundary(
			'Battle by id - ' + battleId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return updatedBattle[0];
};

// Добавление участника в сражение
export const addParticipantToBattle = async (
	battleId: number,
	characterId: number,
	userId: number
) => {
	const battle = await db.query.battles.findFirst({
		where: eq(battles.id, battleId),
	});
	if (!battle) {
		throw new ErrorBoundary(
			'Battle by id - ' + battleId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	const participant = await db
		.insert(battleParticipants)
		.values({ battleId, characterId, userId })
		.returning();

	return participant[0];
};

// Удаление участника из сражения
export const removeParticipantFromBattle = async (
	battleId: number,
	participantId: number
) => {
	const deletedParticipant = await db
		.delete(battleParticipants)
		.where(eq(battleParticipants.id, participantId))
		.returning();

	if (!deletedParticipant.length) {
		throw new ErrorBoundary(
			'Participant by id - ' + participantId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return deletedParticipant[0];
};

// Добавление результатов сражения
export const addBattleResult = async (battleResult: BattleResultInsertType) => {
	const result = await db
		.insert(battleResults)
		.values(battleResult)
		.returning();

	return result[0];
};

// Получение сражения по ID
export const getBattleById = async (battleId: number) => {
	const battle = await db.query.battles.findFirst({
		where: eq(battles.id, battleId),
		with: {
			participants: {
				with: {
					character: true,
					user: true,
				},
			},
			results: true,
		},
	});

	if (!battle) {
		throw new ErrorBoundary(
			'Battle by id - ' + battleId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return battle;
};

// Получение всех сражений
export const getAllBattles = async () => {
	const battles = await db.query.battles.findMany();
	return battles;
};

// Получение участников сражения
export const getBattleParticipants = async (battleId: number) => {
	const participants = await db.query.battleParticipants.findMany({
		where: eq(battleParticipants.battleId, battleId),
		with: {
			character: true,
			user: true,
		},
	});

	return participants;
};

// Получение результатов сражения
export const getBattleResults = async (battleId: number) => {
	const results = await db.query.battleResults.findMany({
		where: eq(battleResults.battleId, battleId),
		with: {
			battle: {
				with: {
					participants: {
						with: {
							character: true,
							user: true,
						},
					},
				},
			},
		},
	});

	return results;
};

// Удаление сражения
export const deleteBattle = async (battleId: number) => {
	const deletedBattle = await db
		.delete(battles)
		.where(eq(battles.id, battleId))
		.returning();

	if (!deletedBattle.length) {
		throw new ErrorBoundary(
			'Battle by id - ' + battleId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return deletedBattle[0];
};
