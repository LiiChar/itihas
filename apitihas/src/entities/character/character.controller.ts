import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CharactersInsertType } from '../../database/db';
import {
	createCharacter,
	updateCharacter,
	getCharacterByUserId,
	getCharacterByHistoryId,
	getCharacterById,
	deleteCharacter,
	addCharacterToUser,
	getCharacters,
} from './character.service';

const characterRouter = Router();

// Создание персонажа
characterRouter.post('/', async (req, res) => {
	try {
		const data = req.body as CharactersInsertType;

		const character = await createCharacter(data);
		return res.status(StatusCodes.CREATED).json(character);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Create character failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Обновление персонажа
characterRouter.put('/', async (req, res) => {
	try {
		const data = req.body as Partial<CharactersInsertType>;

		const character = await updateCharacter(data);
		return res.status(StatusCodes.OK).json(character);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Update character failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

characterRouter.post('/user', async (req, res) => {
	try {
		const { characterId, userId } = req.body as {
			characterId?: number;
			userId?: number;
		};
		if (!userId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'User ID is required' });
		}

		if (!characterId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Character ID is required' });
		}

		const character = await addCharacterToUser(userId, characterId);
		return res.status(StatusCodes.OK).json(character);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get characters failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение персонажей по ID пользователя
characterRouter.get('/user/:id', async (req, res) => {
	try {
		const userId = +req.params.id;
		if (!userId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'User ID is required' });
		}

		const characters = await getCharacterByUserId(userId);
		return res.status(StatusCodes.OK).json(characters);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get characters failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение персонажей по ID истории
characterRouter.get('/history/:id', async (req, res) => {
	try {
		const historyId = +req.params.id;
		if (!historyId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'History ID is required' });
		}

		const characters = await getCharacterByHistoryId(historyId);
		return res.status(StatusCodes.OK).json(characters);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get characters failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение персонажа по ID
characterRouter.get('/:id', async (req, res) => {
	try {
		const characterId = +req.params.id;
		if (!characterId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Character ID is required' });
		}

		const character = await getCharacterById(characterId);
		return res.status(StatusCodes.OK).json(character);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get character failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение персонажа по ID
characterRouter.get('/', async (req, res) => {
	try {
		const characters = await getCharacters();
		return res.status(StatusCodes.OK).json(characters);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get character failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Удаление персонажа по ID
characterRouter.delete('/:id', async (req, res) => {
	try {
		const characterId = +req.params.id;
		if (!characterId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Character ID is required' });
		}

		await deleteCharacter(characterId);
		return res
			.status(StatusCodes.OK)
			.json({ message: 'Character deleted successfully' });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Delete character failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

export { characterRouter };
