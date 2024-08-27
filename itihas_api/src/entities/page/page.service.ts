import { access } from 'fs/promises';
import { PageInsertType, PageType, UserType, db } from '../../database/db';
import { insertDataToContent } from './lib/content';
import { eq, sql } from 'drizzle-orm';
import { pagePoints, pages } from './model/page';
import { histories } from '../history/model/history';
import { layoutComponents } from './type/layout';
import { executeAction } from './lib/action';

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
				columns: {},
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
	console.log(point.action);

	const pageId = await executeAction(point.page.historyId, user, point.action);

	const page = await getCurrentPageByHistoryId(
		point.page.historyId,
		pageId == 0 ? id : pageId,
		user
	);

	return page;
};
