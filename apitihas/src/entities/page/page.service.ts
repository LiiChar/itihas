import { access } from 'fs/promises';
import {
	LayoutType,
	PageInsertType,
	PageType,
	UserType,
	db,
} from '../../database/db';
import { insertDataToContent } from './lib/content';
import { and, asc, desc, eq, min, SQL, sql } from 'drizzle-orm';
import { layouts, pagePoints, pages, userHistoryProgreses } from './model/page';
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
import { Filter } from '../history/history.service';
import { notificationEvent } from '../modules/socket/notification';

export const getCurrentPageByHistoryId = async (
	historyId: number,
	pageId: number,
	user: UserType
) => {
	const currentPage = await db.query.pages.findFirst({
		where: eq(pages.id, pageId),
	});

	const userProgress = await db.query.userHistoryProgreses.findFirst({
		where: and(
			eq(userHistoryProgreses.userId, user.id),
			eq(userHistoryProgreses.historyId, historyId)
		),
		orderBy: (userHistoryProgreses, { desc }) => [
			desc(userHistoryProgreses.completedAt),
		],
	});

	if (!currentPage && pageId != 0 && userProgress) {
		throw new ErrorBoundary(
			'Page not exist in story',
			ReasonPhrases.BAD_REQUEST
		);
	}

	let page = await db.query.pages.findFirst({
		where: (pages, { eq, and }) => {
			let ex;
			if (!userProgress) {
				ex = eq(pages.type, 'start');
			} else if (pageId != 0) {
				ex = eq(pages.id, pageId);
			} else {
				ex = eq(pages.id, userProgress.pageId);
			}
			return and(ex, eq(pages.historyId, historyId));
		},
		with: {
			points: true,

			history: {
				with: {
					layout: true,
				},
			},
			layout: true,
		},
	});

	if (!page) {
		page = await db.query.pages.findFirst({
			where: (pages, { eq }) => eq(pages.historyId, historyId),
			orderBy: (pages, { asc }) => [asc(pages.id)],
			with: {
				points: true,

				history: {
					with: {
						layout: true,
					},
				},
				layout: true,
			},
		});
	}
	if (!page) {
		throw new ErrorBoundary(
			`Не найдено главы по id ${currentPage}`,
			ReasonPhrases.BAD_REQUEST
		);
	}

	const variables = await db.query.variables.findMany({
		where: (variables, { eq, and }) =>
			and(eq(variables.historyId, historyId), eq(variables.userId, user.id)),
	});

	let pagesWithVariables = Object.assign(page, { variables });

	try {
		pagesWithVariables['content'] = await insertDataToContent(
			page.content,
			historyId,
			user.id
		);
	} catch (error) {
		throw new ErrorBoundary('Insert data failed', ReasonPhrases.BAD_REQUEST);
	}

	if (
		pagesWithVariables.layoutId == null &&
		pagesWithVariables.layout == null
	) {
		pagesWithVariables.layout = pagesWithVariables.history.layout as any;
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
		contents &&
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
		contents &&
			contents.forEach((c: any, i: number) => {
				page.history.layout.layout[i].content = c;
			});
	}

	if (page.script) {
		const tokens = parse(page.script);
		const pageId = await run(tokens, null, user, page.historyId, new Map());
		if (pageId) {
			pagesWithVariables = await getCurrentPageByHistoryId(
				historyId,
				pageId,
				user
			);
		}
	}

	if (!!page.keypage) {
		const existedProgress = await db.query.userHistoryProgreses.findFirst({
			where: and(
				eq(userHistoryProgreses.pageId, page.id),
				eq(userHistoryProgreses.userId, user.id),

				eq(userHistoryProgreses.historyId, page.historyId)
			),
		});

		if (!existedProgress) {
			let prevPageId: null | number = null;
			const prevPageByTime = await db.query.userHistoryProgreses.findFirst({
				where: and(
					eq(userHistoryProgreses.userId, user.id),
					eq(userHistoryProgreses.historyId, pagesWithVariables.historyId)
				),
				orderBy: (userHistoryProgreses, { desc }) => [
					desc(userHistoryProgreses.id),
				],
			});
			if (prevPageByTime) {
				prevPageId = prevPageByTime.pageId;
			}
			if (prevPageId != pagesWithVariables.id) {
				await db.insert(userHistoryProgreses).values({
					historyId: pagesWithVariables.historyId,
					pageId: pagesWithVariables.id,
					userId: user.id,
					prevPageId: prevPageId,
				});
				if (prevPageByTime && !prevPageByTime.nextPageId) {
					await db
						.update(userHistoryProgreses)
						.set({
							nextPageId: pagesWithVariables.id,
						})
						.where(eq(userHistoryProgreses.id, prevPageByTime.id));
				}
			}
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
	const pageId = await run(tokens, null, user, historyId, new Map());
	return pageId;
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
		where: and(eq(pagePoints.pageId, pageId), eq(pagePoints.name, data.name)),
	});
	if (existPoint) {
		const updatedPoint = await db
			.update(pagePoints)
			.set({
				action: data.action,
				name: data.name,
				pageId: pageId,
			})
			.where(eq(pagePoints.pageId, pageId))
			.returning();
		return updatedPoint[0];
	} else {
		const createdPoint = await db
			.insert(pagePoints)
			.values({
				action: data.action,
				name: data.name,
				pageId: pageId,
			})
			.returning();
		return createdPoint;
	}
};

export const getPageList = async (historyId?: number) => {
	const findedPages = await db.query.pages.findMany({
		where: historyId ? eq(pages.historyId, historyId) : undefined,
		with: {
			history: true,
		},
	});

	return findedPages;
};

type ParamsPage = {
	offset?: number;
	page?: number;
	orders?: { order: 'asc' | 'desc'; field: string }[];
	filter?: Filter[];
	author?: string;
	limit?: number;
};

export const getPage = async (id: number) => {
	const page = await db.query.pages.findFirst({
		where: eq(pages.id, id),
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
		throw Error(`Page not found by ${id}`);
	}

	return page;
};

export const getPages = async (params: ParamsPage) => {
	function buildWhereClause(filters: Filter[], table: any): SQL {
		const buildFilter = (filter: Filter): SQL => {
			const parts: SQL[] = [];

			if (filter.field && filter.value && filter.operator) {
				const field = filter.field;
				if (!(field in table)) {
					throw new ErrorBoundary(
						`Filed ${field} not exist in table`,
						ReasonPhrases.BAD_REQUEST
					);
				}
				parts.push(
					sql`${table[field]} ${sql.raw(filter.operator)} '${sql.raw(
						filter.value
					)}'`
				);
			}

			if (filter.innerFilters && filter.innerFilters.length > 0) {
				const innerParts: SQL[] = filter.innerFilters.map(innerFilter =>
					buildFilter(innerFilter)
				);
				const conjunction = filter.variant === 'or' ? 'OR' : 'AND';
				parts.push(sql.join(innerParts, sql.raw(` ${conjunction} `)));
			}

			return sql.join(parts, sql.raw(' '));
		};

		return sql.join(
			filters.map(filter => buildFilter(filter)),
			sql.raw(' AND ')
		);
	}
	const whereBuilder = (table: any) => {
		if (!params.filter) {
			return undefined;
		}

		return buildWhereClause(params.filter, table);
	};
	const orderBuilder = (table: any) => {
		const orderResult: SQL[] = [];
		const orderType = {
			asc: asc,
			desc: desc,
		};
		params.orders?.forEach(({ field, order }) => {
			const action = orderType[order];
			const column = table[field as any];
			if (!action && !column) return;
			orderResult.push(action(column));
		});

		return orderResult;
	};
	try {
		let pagesFiltered = await db.query.pages.findMany({
			with: {
				history: true,
			},
			limit: params.limit,
			offset: params.offset,
			orderBy: pages => orderBuilder(pages),
			where: pages => whereBuilder(pages),
		});

		return pagesFiltered;
	} catch (error) {
		throw new ErrorBoundary(
			'Error has been get pages',
			ReasonPhrases.BAD_REQUEST
		);
	}
};

export const updateLayoutPage = async (
	userId: number,
	pageId: number,
	layoutId: number,
	layoutData: Partial<LayoutType>
) => {
	const existLayout = await db.query.layouts.findFirst({
		where: eq(layouts.id, layoutId),
	});
	if (!existLayout) {
		throw new ErrorBoundary(
			`Layout by id ${layoutId} not exist`,
			ReasonPhrases.BAD_REQUEST
		);
	}
	const page = await db.query.pages.findFirst({
		where: eq(pages.id, pageId),
		with: {
			history: true,
		},
	});
	if (!page) {
		throw Error('Page of layout not found');
	}

	if (!page.layoutId || page.history.layoutId == page.layoutId) {
		let newDataLayout = Object.assign(existLayout, layoutData);
		newDataLayout.id = null as unknown as number;
		const createdLayout = await db
			.insert(layouts)
			.values(newDataLayout)
			.returning();
		await db
			.update(pages)
			.set({
				layoutId: createdLayout[0].id,
			})
			.where(eq(pages.id, page.id));
		return createdLayout[0];
	}
	const updatedLayout = await db
		.update(layouts)
		.set(layoutData)
		.where(eq(layouts.id, layoutId))
		.returning();
	return updatedLayout[0];
};
