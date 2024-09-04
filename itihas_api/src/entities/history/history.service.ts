import { access } from 'fs/promises';
import { PageInsertType, PageType, UserType, db } from '../../database/db';
import { insertDataToContent } from './lib/content';
import { sql } from 'drizzle-orm';
import { comments, histories } from './model/history';

export const getHistory = async (id: number, user: UserType) => {
	const history = await db.query.histories.findFirst({
		extras: {
			views: sql<number>`lower(0)`.as('views'),
		},
		where: (histories, { eq }) => eq(histories.id, id),
		with: {
			author: true,
			comments: {
				with: {
					user: true,
					comments: {
						with: {},
					},
				},
			},
			similarHistories: {
				with: {
					similarHistory: true,
				},
			},
			points: true,
			bookmarks: {
				with: {
					bookmark: true,
				},
			},
			pages: {
				with: {
					points: true,
				},
			},
			genres: {
				with: {
					genre: true,
				},
			},
		},
	});

	if (!history) {
		throw Error('Не найдено истории по id ' + id);
	}

	const promises = history.pages.reduce<any[]>((acc: any, page: any) => {
		history['views'] = +history['views'] + page.views;
		acc.push(insertDataToContent(page.content, history.id, user.id));
		return acc;
	}, []);
	const contents = await Promise.all(promises);
	contents.forEach((c: any, i: number) => {
		history.pages[i].content = c;
	});
	return history;
};

export const getHistories = async () => {
	const histories = await db.query.histories.findMany({
		with: {
			genres: {
				with: {
					genre: true,
				},
				limit: 1,
			},
		},
	});
	return histories;
};
