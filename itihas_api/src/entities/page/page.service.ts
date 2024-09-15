import { access } from 'fs/promises';
import { PageInsertType, PageType, UserType, db } from '../../database/db';
import { insertDataToContent } from './lib/content';
import { eq, sql } from 'drizzle-orm';
import { pagePoints, pages } from './model/page';
import { histories } from '../history/model/history';
import { layoutComponents } from './type/layout';
import { executeAction } from './lib/action';
import { pageInsertSchema, pagePointInsertScheme } from './page.scheme';

export const getCurrentPageByHistoryId = async (
	id: number,
	currentPage: number,
	user: UserType
) => {
	const page = await db.query.pages.findFirst({
		where: (pages, { eq, and, or }) => {
			const ex =
				currentPage == 0
					? or(eq(pages.type, 'start'), eq(pages.id, 1))
					: eq(pages.id, currentPage);
			return and(ex, eq(pages.historyId, id));
		},
		with: {
			points: true,
			history: {
				columns: {
					sound: true,
				},
				with: {
					wallpaper: true,
					layout: true,
				},
			},
			layout: true,
			wallpaper: true,
		},
	});

	if (!page) {
		throw Error(`Не найдено главы по id ${currentPage}`);
	}

	const variables = await db.query.variables.findMany({
		where: (variables, { eq, and }) =>
			and(eq(variables.historyId, id), eq(variables.userId, user.id)),
	});

	const pagesWithVariables = Object.assign(page, { variables });

	pagesWithVariables['content'] = await insertDataToContent(
		page.content,
		id,
		user.id
	);

	if (page.layout) {
		const promises = page.layout.layout.reduce<any>((acc: any, p: any) => {
			acc.push(
				p.content
					? insertDataToContent(p.content, page.historyId, user.id)
					: null
			);
			return acc;
		}, []);
		const contents = await Promise.all(promises);
		contents.forEach((c: any, i: number) => {
			page.layout!.layout[i].content = c;
		});
	}

	const promises = page.history.layout.layout.reduce<any[]>(
		(acc: any, p: any) => {
			acc.push(
				p.content
					? insertDataToContent(p.content, page.historyId, user.id)
					: null
			);
			return acc;
		},
		[]
	);
	const contents = await Promise.all(promises);
	contents.forEach((c: any, i: number) => {
		page.history.layout.layout[i].content = c;
	});

	return pagesWithVariables;
};

export const executeActionPage = async (id: number, user: UserType) => {
	const point = await db.query.pagePoints.findFirst({
		where: (points, { eq }) => eq(points.id, id),
		with: {
			page: {
				with: {
					history: true,
				},
			},
		},
	});
	if (!point) {
		throw Error('Не найдено пункта по id - ' + id);
	}

	const pageId = await executeAction(point.page.historyId, user, point.action);

	const page = await getCurrentPageByHistoryId(
		point.page.historyId,
		pageId == 0 ? id : pageId,
		user
	);

	return page;
};

export const createPage = async (id: number, data: pageInsertSchema) => {
	const existPageByName = await db.query.pages.findFirst({
		where: eq(pages.name, data.name),
	});
	if (existPageByName) {
		throw Error(`Страница с названием ${data.name} уже создана!`);
	}
	const value = {
		content: data.content,
		historyId: id,
		name: data.name,
		description: data.description ? data.description : undefined,
		image: data.image ? data.image : undefined,
		sound: data.sound ? data.sound : undefined,
	};
	const page = await db.insert(pages).values(value).returning();
	return page[0];
};

export const updatePage = async (id: number, data: Partial<PageType>) => {
	const updatedPage = await db
		.update(pages)
		.set(data)
		.where(eq(pages.id, id))
		.returning();
	return updatedPage[0];
};

export const createPagePoint = async (
	pageId: number,
	data: pagePointInsertScheme
) => {
	await db.insert(pagePoints).values({
		action: data.action,
		name: data.name,
		pageId: pageId,
	});
};
