import { DrizzleError } from 'drizzle-orm';
import { PageInsertType, VariableInsertType, db } from '../../database/db';
import { faker } from '@faker-js/faker';
import { pages, variables } from './model/page';

export const generatePage = async () => {
	await db.delete(pages);
	const createRandomPage = (): PageInsertType => {
		return {
			name: faker.person.firstName(),
			image: faker.image.url(),
			historyId: 1,
			content: 'Ваше имя {=name} и сейчас начинается ваше приключение',
		};
	};
	const pageArray = faker.helpers.multiple(createRandomPage, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		pageArray.forEach(async page => {
			const { id } = (await db.insert(pages).values(page).returning())[0];
			idx.push(id);
		});
		return {
			factory: 'Создание страницы историй',
			status: true,
			message: 'Все истории успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание страниц историй',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание страниц историй',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};

export const generateVariable = async () => {
	await db.delete(variables);
	const createRandomVariable = (): VariableInsertType => {
		return {
			historyId: 1,
			variable: 'name',
			type: 'string',
			data: 'Владимир',
			userId: 1,
		};
	};
	const variableArray = faker.helpers.multiple(createRandomVariable, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		variableArray.forEach(async variable => {
			const { id } = (
				await db.insert(variables).values(variable).returning()
			)[0];
			idx.push(id);
		});
		return {
			factory: 'Создание данных историй',
			status: true,
			message: 'Все данные успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание данных историй',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание данных историй',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};
