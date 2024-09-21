import { DrizzleError } from 'drizzle-orm';
import { UserType, db } from '../../database/db';
import { faker } from '@faker-js/faker';
import { users } from './model/user';

export const generateUsers = async () => {
	await db.delete(users);
	const createRandomUser = (): Pick<UserType, 'name' | 'password'> => {
		return {
			name: faker.person.firstName(),
			password: '$2b$06$j8YfOMk8muT4UCZhYRM32.ymitBl.DnR7id/9ujI70H2.tJwySgj.',
		};
	};
	const userArray: Pick<UserType, 'name' | 'password'>[] =
		faker.helpers.multiple(createRandomUser, {
			count: 10,
		});

	try {
		const idx: number[] = [];
		userArray.forEach(async user => {
			const { id } = (await db.insert(users).values(user).returning())[0];
			idx.push(id);
		});
		return {
			factory: 'Создание пользователей',
			status: true,
			message: 'Все пользователи успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание пользователей',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание пользователей',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};
