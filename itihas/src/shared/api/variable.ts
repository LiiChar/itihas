import { URL } from '../const/const';
import { VariableHistory } from '../type/variable';
import { axi } from './axios/axios';

const BASE_URL = `${URL}/variable`;

export const getVariable = async (historyId: number, userId: number) => {
	const data = await axi.get<VariableHistory[]>(BASE_URL, {
		params: {
			user: userId,
			history: historyId,
		},
	});

	return data.data;
};

export type Data = Record<
	string,
	{
		key: string;
		data: string;
	}
>;

export const updateVariables = async (
	datas: Data,
	historyId: number,
	userId: number
) => {
	const data = await axi.post<VariableHistory[]>(BASE_URL, datas, {
		params: {
			user: userId,
			history: historyId,
		},
	});

	return data.data;
};

export const getVariableHistory = async (historyId: number) => {
	const data = await axi.get<VariableHistory[]>(BASE_URL + '/history', {
		params: {
			history: historyId,
		},
	});

	return data.data;
};

export const getVariableUser = async (userId: number) => {
	const data = await axi.get<VariableHistory[]>(BASE_URL + '/user', {
		params: {
			user: userId,
		},
	});

	return data.data;
};
