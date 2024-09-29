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
	bookmarksToHistories,
	characters,
	comments,
	commentsToComments,
	genres,
	genresToHistories,
	histories,
	similarHistories,
} from './model/history';
import { randomRangeInt } from '../../lib/num';
import { randomInt } from 'crypto';

export const generateHistory = async () => {
	await db.delete(histories);
	const createRandomHistory = (): HistoryInsertType => {
		return {
			name:
				faker.person.prefix() +
				' ' +
				faker.person.firstName() +
				' ' +
				faker.person.suffix(),
			image: faker.image.url(),
			description: faker.lorem.text(),
			sound: '/uploads/sound/default/Apocryphos-Simulacrum-of-Stone.mp3',
			rate: randomInt(0, 5),
			authorId: randomRangeInt(1, 10),
		};
	};
	const historyArray = faker.helpers.multiple(createRandomHistory, {
		count: 100,
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

			idx.push(id);
		});
		for (let i = 1; i <= 100; i++) {
			await db.insert(genresToHistories).values({
				genreId: randomRangeInt(1, 10),
				historyId: i,
			});
		}
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
			historyId: randomRangeInt(1, 10),
			userId: randomRangeInt(1, 10),
			content: faker.lorem.paragraphs(4),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 40,
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

export const generateReplyComment = async () => {
	const table = commentsToComments;
	const name = 'ответы к комментариям';
	await db.delete(table);
	const createRandom = (): typeof table.$inferInsert => {
		return {
			content: faker.lorem.sentence({ min: 1, max: 2 }),
			userId: randomRangeInt(1, 10),
			commentId: randomRangeInt(1, 40),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 1,
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

export const generateSimilar = async () => {
	const table = similarHistories;
	await db.delete(table);
	const createRandom = (): SimilarInsertType => {
		return {
			historyId: randomRangeInt(1, 10),
			similarHistoryId: randomRangeInt(1, 10),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 20,
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

export const generateCharacters = async () => {
	const table = characters;
	const name = 'персонажи';
	console.log('Создание ' + name);
	await db.delete(table);

	const createRandom = (): typeof table.$inferInsert => {
		return {
			name: faker.person.fullName(),
			historyId: randomRangeInt(1, 10),
			image: faker.image.avatar(),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 30,
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

export const generateBookmarkToHistory = async () => {
	const table = bookmarksToHistories;
	const name = 'истории в закладки';
	console.log('Создание ' + name);

	await db.delete(table);
	const createRandom = (): typeof table.$inferInsert => {
		return {
			bookmarkId: randomRangeInt(51, 55),
			historyId: randomRangeInt(1, 100),
		};
	};
	const array = faker.helpers.multiple(createRandom, {
		count: 200,
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
