import { URL } from '../const/const';
import { User, UserAll } from '../type/user';
import { axi } from './axios/axios';

const BASE_URL = URL + '/user';

export type LoginUser = {
	name: string;
	password: string;
};

export const authicated = async (id: number) => {
	const data = await axi.get<boolean>(`${BASE_URL}/authicated/${id}`);
	return data;
};

export const loginUser = async (user: LoginUser) => {
	try {
		const data = await axi.post<User>(`${BASE_URL}/login`, user, {});
		return data;
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			error.response !== null &&
			'data' in error.response
		) {
			return error.response.data as { error: string };
		} else {
			throw Error('Undefined error by login user');
		}
	}
};

export type RegisterUser = {
	email?: string;
	name: string;
	password: string;
};

export const registerUser = async (user: RegisterUser) => {
	const data = await axi.post<User>(`${BASE_URL}/register`, user);
	return data;
};

export const getUserById = async (userId: number) => {
	const user = await axi.get<UserAll>(`${BASE_URL}/${userId}`);

	return user;
};

export const updateUser = async (userData: Partial<User>) => {
	const user = await axi.put<User>(`${BASE_URL}/update`, userData);

	return user.data;
};
