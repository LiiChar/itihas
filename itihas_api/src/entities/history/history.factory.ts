import { DrizzleError } from 'drizzle-orm';
import {
	CommentInsertType,
	GenreInsertType,
	HistoryInsertType,
	PageInsertType,
	SimilarInsertType,
	UserType,
	VariableInsertType,
	db,
} from '../../database/db';
import { faker } from '@faker-js/faker';
import {
	comments,
	genres,
	genresToHistories,
	histories,
	similarHistories,
} from './model/history';
import { randomRangeInt } from '../../lib/num';

export const generateHistory = async () => {
	await db.delete(histories);
	const createRandomHistory = (): HistoryInsertType => {
		return {
			name: faker.person.firstName(),
			image: '/uploads/image/10c4175d9c7f128e1d8b1eeb682eabeb.jpg',
			description: faker.lorem.text(),
			authorId: 1,
		};
	};
	const historyArray = faker.helpers.multiple(createRandomHistory, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		historyArray.forEach(async history => {
			const { id } = (
				await db.insert(histories).values(history).returning()
			)[0];
			idx.push(id);
		});
		return {
			factory: 'Создание истории',
			status: true,
			message: 'Все истории успешно созданы',
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

export const generateGenre = async () => {
	await db.delete(genres);
	const createRandomGenre = (): GenreInsertType => {
		return {
			name: faker.word.words(1),
		};
	};
	const genreArray = faker.helpers.multiple(createRandomGenre, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		genreArray.forEach(async genre => {
			const { id } = (await db.insert(genres).values(genre).returning())[0];
			await db.insert(genresToHistories).values({ genreId: id, historyId: 1 });
			idx.push(id);
		});
		return {
			factory: 'Создание жарнов',
			status: true,
			message: 'Все жанры успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание жарнов',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание жанров',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};

export const generateComments = async () => {
	await db.delete(comments);
	const createRandom = (): CommentInsertType => {
		return {
			historyId: 1,
			userId: 1,
			content: faker.lorem.paragraphs(4),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		array.forEach(async data => {
			const { id } = (await db.insert(comments).values(data).returning())[0];
			idx.push(id);
		});
		return {
			factory: 'Создание данных комментарии',
			status: true,
			message: 'Все данные успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание данных комментарии',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание данных комментарии',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};

export const generateSimilar = async () => {
	const table = similarHistories;
	await db.delete(table);
	const createRandom = (): SimilarInsertType => {
		return {
			historyId: 1,
			similarHistoryId: randomRangeInt(1, 10),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 10,
	});

	try {
		const idx: number[] = [];
		array.forEach(async data => {
			const { id } = (await db.insert(table).values(data).returning())[0];
			idx.push(id);
		});

		return {
			factory: 'Создание данных похожие',
			status: true,
			message: 'Все данные успешно созданы',
			idx: idx,
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return {
				factory: 'Создание данных похожие',
				status: false,
				message: error.message,
			};
		} else {
			return {
				factory: 'Создание данных похожие',
				status: false,
				message: 'Произошла непредвиденная ошибка',
			};
		}
	}
};
