import { eq } from 'drizzle-orm';
import { ReasonPhrases } from 'http-status-codes';
import { db, CharactersInsertType } from '../../database/db';
import { ErrorBoundary } from '../../lib/error';
import { histories } from '../history/model/history';
import { users } from '../user/model/user';
import { characters, charactersToUsers } from './model/character';

// Получение персонажа по ID
export const getCharacterById = async (characterId: number) => {
	const character = await db.query.characters.findFirst({
		where: eq(characters.id, characterId),
		with: {
			battleParticipants: {
				with: {
					battle: {
						with: {
							results: true,
						},
					},
				},
			},
			users: {
				with: {
					user: true,
				},
			},
			history: true,
			user: true,
		},
	});

	if (!character) {
		throw new ErrorBoundary(
			'Character by id - ' + characterId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return character;
};

export const getCharacters = async () => {
	const character = await db.query.characters.findMany();

	return character;
};

// Получение персонажей по ID истории
export const getCharacterByHistoryId = async (historyId: number) => {
	const charactersQuery = await db.query.characters.findMany({
		where: eq(characters.historyId, historyId),
	});

	return charactersQuery;
};

// Создание персонажа
export const createCharacter = async (data: CharactersInsertType) => {
	const history = await db.query.histories.findFirst({
		where: eq(histories.id, data.historyId),
	});
	if (!history) {
		throw new ErrorBoundary(
			'History by id - ' + data.historyId + ' not found',
			ReasonPhrases.BAD_REQUEST
		);
	}

	const newCharacter = await db.insert(characters).values(data).returning();
	return newCharacter[0];
};

// Обновление персонажа
export const updateCharacter = async (data: Partial<CharactersInsertType>) => {
	if (!data.id) {
		throw new ErrorBoundary(
			'Character ID is required for update',
			ReasonPhrases.BAD_REQUEST
		);
	}

	const updatedCharacter = await db
		.update(characters)
		.set(data)
		.where(eq(characters.id, data.id))
		.returning();

	if (!updatedCharacter.length) {
		throw new ErrorBoundary(
			'Character by id - ' + data.id + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return updatedCharacter[0];
};

// Получение персонажей по ID пользователя
export const getCharacterByUserId = async (userId: number) => {
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
		with: {
			characters: {
				with: {
					character: true,
				},
			},
		},
	});

	if (!user) {
		throw new ErrorBoundary(
			'User by id - ' + userId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return user.characters.map((c: { character: any }) => c.character);
};

// Удаление персонажа
export const deleteCharacter = async (characterId: number) => {
	const deletedCharacter = await db
		.delete(characters)
		.where(eq(characters.id, characterId))
		.returning();

	if (!deletedCharacter.length) {
		throw new ErrorBoundary(
			'Character by id - ' + characterId + ' not found',
			ReasonPhrases.NOT_FOUND
		);
	}

	return deletedCharacter[0];
};

export const addCharacterToUser = async (
	userId: number,
	characterId: number
) => {
	try {
		const relatioonChatacterToUser = await db
			.insert(charactersToUsers)
			.values({
				characterId,
				userId,
			})
			.returning();
		return relatioonChatacterToUser;
	} catch (error) {
		throw new ErrorBoundary(
			'Add character by id - ' +
				characterId +
				' failed add to user by id' +
				userId,
			ReasonPhrases.BAD_REQUEST
		);
	}
};
