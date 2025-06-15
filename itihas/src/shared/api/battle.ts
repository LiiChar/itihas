import { URL } from '../const/const';
import {
	Battle,
	BattleAll,
	BattleParticipant,
	BattleParticipants,
	BattleResult,
} from '../type/battle';
import { axi } from './axios/axios';

const BASE_URL = `${URL}/battle`;

// Создание сражения
export const createBattle = async (name: string) => {
	const data = await axi.post<Battle>(BASE_URL, { name });
	return data.data;
};

// Обновление сражения
export const updateBattle = async (
	battleId: number,
	data: Partial<BattleParticipants>
) => {
	const res = await axi.put<Battle>(`${BASE_URL}/${battleId}`, data);
	return res.data;
};

// Добавление участника в сражение
export const addParticipantToBattle = async (
	battleId: number,
	characterId: number,
	userId: number
) => {
	const data = await axi.post<BattleParticipant>(
		`${BASE_URL}/${battleId}/participant`,
		{ characterId, userId }
	);
	return data.data;
};

// Удаление участника из сражения
export const removeParticipantFromBattle = async (
	battleId: number,
	participantId: number
) => {
	const data = await axi.delete<{ message: string }>(
		`${BASE_URL}/${battleId}/participant/${participantId}`
	);
	return data.data;
};

// Добавление результатов сражения
export const addBattleResult = async (
	result: Pick<BattleResult, 'battleId' | 'log' | 'result' | 'status'>
) => {
	const data = await axi.post<BattleResult>(
		`${BASE_URL}/${result.battleId}/result`,
		result
	);
	return data.data;
};

// Получение сражения по ID
export const getBattleById = async (battleId: number) => {
	const data = await axi.get<BattleAll>(`${BASE_URL}/${battleId}`);
	return data.data;
};

// Получение всех сражений
export const getAllBattles = async () => {
	const data = await axi.get<Battle[]>(`${BASE_URL}`);
	return data.data;
};

// Получение участников сражения
export const getBattleParticipants = async (battleId: number) => {
	const data = await axi.get<BattleParticipant[]>(
		`${BASE_URL}/${battleId}/participants`
	);
	return data.data;
};

// Получение результатов сражения
export const getBattleResults = async (battleId: number) => {
	const data = await axi.get<BattleResult[]>(`${BASE_URL}/${battleId}/results`);
	return data.data;
};

// Удаление сражения
export const deleteBattle = async (battleId: number) => {
	const data = await axi.delete<{ message: string }>(`${BASE_URL}/${battleId}`);
	return data.data;
};
