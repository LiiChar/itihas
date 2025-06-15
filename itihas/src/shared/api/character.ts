import { URL } from '../const/const';
import { Character, CharacterAll, CharacterInsert } from '../type/character';
import { axi } from './axios/axios';

const BASE_URL = URL + '/character';

export const getCharacters = async () => {
	const characters = await axi.get<Character[]>(BASE_URL + `/`);

	if (!Array.isArray(characters.data)) {
		return [];
	}

	return characters.data;
};

export const getCharactersById = async (chacracterId: number) => {
	const { data } = await axi.get<CharacterAll>(BASE_URL + `/${chacracterId}`);

	if (!(typeof data == 'object')) {
		return null;
	}

	const characters = data as CharacterAll;

	return characters;
};

export const getCharactersByHistoryId = async (historyId: number) => {
	const characters = await axi.get<Character[]>(BASE_URL + `/${historyId}`);

	if (!Array.isArray(characters.data)) {
		return [];
	}

	return characters.data;
};

export const getCharactersByUserId = async (userId: number) => {
	const characters = await axi.get<Character[]>(BASE_URL + `/user/${userId}`);

	if (!Array.isArray(characters.data)) {
		return [];
	}

	return characters.data;
};

export const addCharacterToUser = async (
	userId: number,
	characterId: number
) => {
	const characters = await axi.post<Character>(BASE_URL + `/user/`, {
		userId,
		characterId,
	});

	if (!(typeof characters.data == 'object')) {
		return null;
	}

	return characters.data;
};

export const createCharacter = async (data: CharacterInsert) => {
	const character = await axi.post<Character>(BASE_URL, data);

	if (typeof character.data === 'string') {
		return null;
	}

	return character.data;
};

export const updateCharacter = async (
	data: Partial<CharacterInsert> & { id: number }
) => {
	const character = await axi.put<Character>(BASE_URL, data);

	if (typeof character.data == 'string') {
		return null;
	}

	return character.data;
};
