import { DrizzleError, Table } from 'drizzle-orm';
import {
	BookmarkInsertType,
	BookmarkType,
	PageInsertType,
	VariableInsertType,
	db,
} from '../../database/db';
import { faker } from '@faker-js/faker';
import {
	layouts,
	likePages,
	pagePoints,
	pages,
	variables,
	wallpapers,
} from './model/page';
import { randomRangeInt } from '../../lib/num';
import { layoutComponents } from './type/layout';
import { bookmarks, comments } from '../history/model/history';
import { createDefaulBookmarks } from '../../lib/default';

export const generatePage = async (pagesDefault?: PageInsertType[]) => {
	await db.delete(pages);
	const createRandomPage = (): PageInsertType => {
		return {
			name: faker.person.firstName(),
			image: faker.image.url(),
			historyId: 1,
			content: 'Ваше имя {=name} и сейчас начинается ваше приключение',
		};
	};
	const pageArray =
		pagesDefault ||
		faker.helpers.multiple(createRandomPage, {
			count: 10,
		});

	pageArray[2] = {
		...pageArray[2],
		sound: '/uploads/sound/default/Shoot-sound.mp3',
	};

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

	variableArray.push({
		data: '100',
		type: 'number',
		historyId: 1,
		userId: 1,
		variable: 'hp',
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

export const generatePagePoint = async (
	pagePointDefault?: (typeof pagePoints.$inferInsert)[]
) => {
	const table = pagePoints;
	const name = 'поитов страницы';
	await db.delete(table);
	let id = 20;
	const createRandom = (): typeof table.$inferInsert => {
		return {
			id,
			name: `Перейти на глвау ${id + 1}`,
			pageId: 1,
			action: `set(name,${faker.person.firstName()});move(${++id});`,
		};
	};
	const array =
		pagePointDefault ||
		faker.helpers.multiple(createRandom, {
			count: 50,
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

export const generateWallpaper = async () => {
	const table = wallpapers;
	const name = 'обоев';
	await db.delete(table);
	const wallpapersArray = [
		'yoon-hye.jpg',
		'succulent.png',
		'stairs.jpg',
		'retro-pc.png',
		'prakasam-mathaiyan.jpg',
		'plant.png',
		'lonely_tree.jpg',
		'kien-do-uUVkzxDR1D0-unsplash.jpg',
		'fog_forest_alt_2.png',
		'fog_forest_2.png',
		'clay-banks-u27Rrbs9Dwc-unsplash.jpg',
	];
	const createRandom = (): typeof table.$inferInsert => {
		return {
			name: faker.lorem.sentence(),
			source: `/uploads/wallpaper/${wallpapersArray[randomRangeInt(0, 9)]}`,
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

export const generateLayout = async () => {
	const table = layouts;
	const name = 'оформления';
	await db.delete(table);
	const defaultLayout: layoutComponents = [
		{
			type: 'image',
			align: 'center',
			style: '',
			content: null,
		},
		{
			type: 'content',
			align: 'center',
			style: '',
			content: null,
		},
		{
			type: 'points',
			align: 'center',
			style: '',
			content: null,
		},
	];
	const createRandom = (): typeof table.$inferInsert => {
		return {
			name: faker.lorem.sentence({ min: 1, max: 2 }),
			layout: defaultLayout,
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

export const generateBookmarks = async () => {
	const table = bookmarks;
	const name = 'закладки';
	await db.delete(table);

	try {
		const idx = await createDefaulBookmarks(1);

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

export const generateLikePages = async () => {
	const table = likePages;
	const name = 'нравиться';
	await db.delete(table);
	const createRandom = (): typeof table.$inferInsert => {
		return {
			pageId: randomRangeInt(1, 10),
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
