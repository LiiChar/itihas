import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
	createBattle,
	addParticipantToBattle,
	getBattleById,
	getBattleResults,
	deleteBattle,
	updateBattle,
	removeParticipantFromBattle,
	addBattleResult,
	getAllBattles,
	getBattleParticipants,
} from './battle.service';

const battleRouter = Router();

// Создание сражения
battleRouter.post('/', async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle name is required' });
		}

		const battle = await createBattle(name);
		return res.status(StatusCodes.CREATED).json(battle);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Create battle failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Обновление сражения
battleRouter.put('/:id', async (req, res) => {
	try {
		const battleId = +req.params.id;
		const data = req.body;

		if (!battleId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID are required' });
		}

		const updatedBattle = await updateBattle(battleId, data);
		return res.status(StatusCodes.OK).json(updatedBattle);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Update battle failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Добавление участника в сражение
battleRouter.post('/:id/participant', async (req, res) => {
	try {
		const battleId = +req.params.id;
		const { characterId, userId } = req.body;

		if (!battleId || !characterId || !userId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID, Character ID, and User ID are required' });
		}

		const participant = await addParticipantToBattle(
			battleId,
			characterId,
			userId
		);
		return res.status(StatusCodes.CREATED).json(participant);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Add participant failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Удаление участника из сражения
battleRouter.delete('/:id/participant/:participantId', async (req, res) => {
	try {
		const battleId = +req.params.id;
		const participantId = +req.params.participantId;

		if (!battleId || !participantId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID and Participant ID are required' });
		}

		await removeParticipantFromBattle(battleId, participantId);
		return res
			.status(StatusCodes.OK)
			.json({ message: 'Participant removed successfully' });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: 'Remove participant failed. Cause: ' + error.message,
			});
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Добавление результатов сражения
battleRouter.post('/:id/result', async (req, res) => {
	try {
		const battleId = +req.params.id;
		const data = req.body;

		if (!data.battleId || !data.status) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID and Status are required' });
		}

		const result = await addBattleResult(data);
		return res.status(StatusCodes.CREATED).json(result);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Add battle result failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение сражения по ID
battleRouter.get('/:id', async (req, res) => {
	try {
		const battleId = +req.params.id;
		if (!battleId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID is required' });
		}

		const battle = await getBattleById(battleId);
		return res.status(StatusCodes.OK).json(battle);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get battle failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение всех сражений
battleRouter.get('/', async (req, res) => {
	try {
		const battles = await getAllBattles();
		return res.status(StatusCodes.OK).json(battles);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get battles failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение участников сражения
battleRouter.get('/:id/participants', async (req, res) => {
	try {
		const battleId = +req.params.id;
		if (!battleId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID is required' });
		}

		const participants = await getBattleParticipants(battleId);
		return res.status(StatusCodes.OK).json(participants);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get participants failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Получение результатов сражения
battleRouter.get('/:id/results', async (req, res) => {
	try {
		const battleId = +req.params.id;
		if (!battleId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID is required' });
		}

		const results = await getBattleResults(battleId);
		return res.status(StatusCodes.OK).json(results);
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Get battle results failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

// Удаление сражения
battleRouter.delete('/:id', async (req, res) => {
	try {
		const battleId = +req.params.id;
		if (!battleId) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Battle ID is required' });
		}

		await deleteBattle(battleId);
		return res
			.status(StatusCodes.OK)
			.json({ message: 'Battle deleted successfully' });
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'Delete battle failed. Cause: ' + error.message });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal server error' });
	}
});

export { battleRouter };
