import { URL } from '../const/const';
import { User, UserAll } from '../type/user';
import { axi } from './axios/axios';

const BASE_URL = URL + '/user';

export type LoginUser = {
	name: string;
	password: string;
};

export const authicated = async () => {
	const data = await axi.get<boolean>(`${BASE_URL}/authicated`);
	return data;
};

export const loginUser = async (user: LoginUser) => {
	const data = await axi.post<User>(`${BASE_URL}/login`, user, {});

	return data;
};

export type RegisterUser = {
	email: string;
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
