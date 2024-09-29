import { DrizzleError, eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { faker } from '@faker-js/faker';
import { users } from './model/user';
import {
	bookmarksToHistories,
	charactersToUsers,
} from '../history/model/history';
import { randomRangeInt } from '../../lib/num';
import { createDefaulBookmarks } from '../../lib/default';
import bcrypt from 'bcrypt';

const createUser = async () => {
	const salt = await bcrypt.genSalt(6);
	const hashedPassword = await bcrypt.hash('itihas123', salt);
	let name = faker.person.fullName() + randomRangeInt(0, 10000);
	let exist = await db.query.users.findFirst({
		where: eq(users.name, name),
	});
	if (exist) {
		name += faker.person.fullName() + randomRangeInt(0, 10000);
	}
	const user = (
		await db
			.insert(users)
			.values({
				name: faker.person.fullName() + randomRangeInt(0, 10000),
				email: faker.lorem.word() + '@media.com',
				password: hashedPassword,
			})
			.returning()
	)[0];

	await createDefaulBookmarks(user.id);
	return user.id;
};

export const generateCharactersToUsers = async () => {
	const table = charactersToUsers;
	const name = 'персонажей к пользователям';

	await db.delete(table);
	const createRandom = (): typeof table.$inferInsert => {
		return {
			characterId: randomRangeInt(1, 10),
			userId: randomRangeInt(1, 10),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 40,
	});

	try {
		const idx: number[] = [];
		array.forEach(async data => {
			const { id } = (await db.insert(table).values(data).returning())[0];
			idx.push(id);
		});

		return {
			factory: 'Создание данных ' + name,
			status: true,
			message: 'Все данные успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание данных ' + name,
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание данных ' + name,
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};

export const generateUsers = async () => {
	console.log('Создание пользователей');

	// await db.delete(users);
	try {
		const idx: number[] = [];
		for (let i = 0; i < 10; i++) {
			const id = await createUser();
			idx.push(id);
		}
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
