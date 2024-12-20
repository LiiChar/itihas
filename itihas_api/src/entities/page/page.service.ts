import { access } from 'fs/promises';
import { PageInsertType, PageType, UserType, db } from '../../database/db';
import { insertDataToContent } from './lib/content';
import { eq, min, sql } from 'drizzle-orm';
import { pagePoints, pages } from './model/page';
import { histories } from '../history/model/history';
import { layoutComponents } from './type/layout';
import { executeAction } from './lib/action';
import {
	pageInsertSchema,
	pagePointInsertScheme,
	pagePointUpdateScheme,
} from './page.scheme';
import { parse, run } from './lib/actionV2';
import { replaceAll } from '../../lib/string';
import { ErrorBoundary } from '../../lib/error';
import { users } from '../user/model/user';
import { ReasonPhrases } from 'http-status-codes';

export const getCurrentPageByHistoryId = async (
	id: number,
	currentPage: number,
	user: UserType
) => {
	const firstPage = await db
		.select({ id: min(pages.id) })
		.from(pages)
		.where(eq(pages.historyId, id));

	if (firstPage.length == 0 && !firstPage[0].id) {
		throw new ErrorBoundary(
			'Page not exist in story',
			ReasonPhrases.BAD_REQUEST
		);
	}
	const page = await db.query.pages.findFirst({
		where: (pages, { eq, and, or }) => {
			let ex;
			if (currentPage == 0) {
				ex = or(eq(pages.type, 'start'), eq(pages.id, firstPage[0]!.id!));
			} else {
				ex = eq(pages.id, currentPage);
			}
			return and(ex, eq(pages.historyId, id));
		},
		with: {
			points: true,
			history: {
				columns: {
					sound: true,
				},
				with: {
					layout: true,
				},
			},
			layout: true,
		},
	});

	if (!page) {
		throw new ErrorBoundary(
			`Не найдено главы по id ${currentPage}`,
			ReasonPhrases.BAD_REQUEST
		);
	}

	const variables = await db.query.variables.findMany({
		where: (variables, { eq, and }) =>
			and(eq(variables.historyId, id), eq(variables.userId, user.id)),
	});

	let pagesWithVariables = Object.assign(page, { variables });

	try {
		pagesWithVariables['content'] = await insertDataToContent(
			page.content,
			id,
			user.id
		);
	} catch (error) {
		throw new ErrorBoundary('Code run failed', ReasonPhrases.BAD_REQUEST);
	}

	if (pagesWithVariables.layout) {
		if (typeof pagesWithVariables.layout.layout == 'string') {
			pagesWithVariables.layout.layout = JSON.parse(
				pagesWithVariables.layout.layout
			);
		}
		const promises = pagesWithVariables.layout.layout.reduce<any>(
			(acc: any, p: any) => {
				acc.push(
					p.content
						? insertDataToContent(
								p.content,
								pagesWithVariables.historyId,
								user.id
						  )
						: p.content
				);
				return acc;
			},
			[]
		);
		const contents = await Promise.all(promises);
		contents.forEach((c: any, i: number) => {
			pagesWithVariables.layout!.layout[i].content = c;
		});
	}

	if (pagesWithVariables.variables) {
		pagesWithVariables.variables = pagesWithVariables.variables.map(v => {
			try {
				if (['array', 'object'].includes(v.type)) {
					v.data = JSON.parse(replaceAll(v.data, '\\', ''));
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error);
				}
			}
			return v;
		});
	}
	if (Array.isArray(page.history.layout.layout)) {
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
	}

	if (page.script) {
		const tokens = parse(page.script);
		const pageId = await run(tokens, null, user, page.historyId, new Map());
		if (pageId) {
			pagesWithVariables = await getCurrentPageByHistoryId(id, pageId, user);
		}
	}

	return pagesWithVariables;
};

export const runCode = async (
	code: string,
	historyId: number,
	userId: number
) => {
	const tokens = parse(code);
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
	});
	if (!user) {
		throw new ErrorBoundary('User not exist', ReasonPhrases.BAD_REQUEST);
	}
	await run(tokens, null, user, historyId, new Map());
};

export const deleteActionById = async (actionId: number) => {
	await db.delete(pagePoints).where(eq(pagePoints.id, actionId));
};

export const updateAction = async (
	actionId: number,
	data: pagePointUpdateScheme
) => {
	const newAction = await db
		.update(pagePoints)
		.set(data as any)
		.where(eq(pagePoints.id, actionId))
		.returning();
	return newAction[0];
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
		throw new ErrorBoundary(
			'Не найдено пункта по id - ' + id,
			ReasonPhrases.BAD_REQUEST
		);
	}

	const tokens = parse(point.action);
	const pageId = await run(tokens, null, user, 1, new Map());

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
		throw new ErrorBoundary(
			`Страница с названием ${data.name} уже создана!`,
			ReasonPhrases.BAD_REQUEST
		);
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
	const existPoint = await db.query.pagePoints.findFirst({
		where: eq(pagePoints.name, data.name),
	});
	if (existPoint) {
		await db.update(pagePoints).set({
			action: data.action,
			name: data.name,
			pageId: pageId,
		});
		return;
	}
	await db.insert(pagePoints).values({
		action: data.action,
		name: data.name,
		pageId: pageId,
	});
};
