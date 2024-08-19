import { UserType } from '../database/db';

export type jwtData = {
	id: number;
	name: string;
	role: UserType['role'];
	email: string | null;
};
