import { access } from 'fs/promises';
import {
	CommentInsertType,
	HistoryInsertType,
	HistoryType,
	LayoutType,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
	LikeHistoryInsertType,
	LikeHistoryType,
	PageInsertType,
	PageType,
	SimilarInsertType,
	UserType,
	db,
} from '../../database/db';
import { insertDataToContent } from './lib/content';
import { and, asc, count, desc, eq, SQL, sql, Table } from 'drizzle-orm';
import {
	comments,
	histories,
	likesToHistories,
	likeToCommentComments,
	likeToComments,
	similarHistories,
} from './model/history';
import { ErrorBoundary } from '../../lib/error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { socket } from '../..';
import { layouts } from '../page/model/page';

export const getHistory = async (id: number, user: UserType) => {
	const history = await db.query.histories.findFirst({
		extras: {
			views: sql<number>`lower(0)`.as('views'),
		},
		where: (histories, { eq }) => eq(histories.id, id),
		with: {
			author: true,
			characters: true,
			likes: true,
			comments: {
				with: {
					user: true,
					likes: true,
					comments: {
						with: {},
					},
				},
				orderBy: (histories, { desc }) => [desc(histories.createdAt)],
			},
			similarHistories: {
				with: {
					similarHistory: true,
				},
				orderBy: (sim, { desc }) => [desc(sim.similar)],
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
			layout: true,
		},
	});

	if (!history) {
		throw Error('Не найдено истории по id ' + id);
	}

	const similar = await db.query.similarHistories.findMany({
		where: (similar, { eq }) => eq(similar.historyId, history.id),
		with: {
			similarHistory: true,
		},
	});

	history.similarHistories = [...history.similarHistories, ...similar];

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

export const createHistory = async (data: HistoryInsertType) => {
	const existHistory = await db.query.histories.findFirst({
		where: eq(histories.name, data.name),
	});

	if (existHistory) {
		throw new ErrorBoundary(
			'История с таким названием уже существует',
			ReasonPhrases.BAD_REQUEST
		);
	}

	const history = await db.insert(histories).values(data).returning();

	return history[0];
};

type KeyParam = 'offset' | 'page' | 'order' | 'genres' | 'author' | 'limit';

export type Filter = {
	field?: string;
	value?: string;
	innerFilters?: Filter[];
	variant?: 'or' | 'and';
	operator?: 'like' | '=' | '<' | '>' | '!=';
};

type Params = {
	offset?: number;
	page?: number;
	orders?: { order: 'asc' | 'desc'; field: string }[];
	filter?: Filter[];
	author?: string;
	limit?: number;
	genres?: { genre: string; allow: string }[];
	tags?: { tag: string; allow: string }[];
};

export const getHistories = async (params: Params) => {
	// TODO
	function buildWhereClause(filters: Filter[], table: any): SQL {
		const replacesField: Record<string, string> = {
			genre: 'name',
		};
		const buildFilter = (filter: Filter): SQL => {
			const parts: SQL[] = [];

			if (filter.field && filter.value && filter.operator) {
				const field = replacesField[filter.field] ?? filter.field;
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
			const column = table[field as keyof HistoryType];
			if (!action && !column) return;
			orderResult.push(action(column));
		});

		return orderResult;
	};

	let historiesFiltered = await db.query.histories.findMany({
		with: {
			genres: {
				with: {
					genre: true,
				},
			},
		},
		limit: params.limit,
		offset: params.offset,
		orderBy: history => orderBuilder(history),
		where: history => whereBuilder(history),
	});
	if (params.genres && params.genres.length > 0) {
		historiesFiltered = historiesFiltered.filter(h => {
			let allow = true;
			params.genres!.forEach(g => {
				const isFinded = !!h.genres.find(
					(ig: any) => ig.genre.name === g.genre
				);

				allow = isFinded == true && g.allow == 'true' ? true : false;
			});
			return allow;
		});
	}
	return historiesFiltered;
};

export const getLayouts = async () => {
	let layouts = await db.query.layouts.findMany();
	layouts = layouts.map(l => {
		if (!Array.isArray(l.layout)) {
			l.layout = JSON.parse(l.layout);
		}
		return l;
	});
	return layouts;
};

export const updateLayout = async (
	userId: number,
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
	if (userId != existLayout.userId) {
		let newDataLayout = Object.assign(existLayout, layoutData);
		newDataLayout.id = null as unknown as number;
		const createdLayout = await db
			.insert(layouts)
			.values(newDataLayout)
			.returning();
		await db.update(histories).set({
			layoutId: createdLayout[0].id,
		});
		return createdLayout[0];
	}
	const updatedLayout = await db
		.update(layouts)
		.set(layoutData)
		.where(eq(layouts.id, layoutId))
		.returning();
	return updatedLayout[0];
};

export const updateHistory = async (
	id: number,
	updatedData: Partial<HistoryType>
) => {
	const updatedHistory = await db
		.update(histories)
		.set(updatedData)
		.where(eq(histories.id, id))
		.returning();
	return updatedHistory[0];
};

export const updateLikeHistory = async (data: LikeHistoryInsertType) => {
	const likes = await db.query.likesToHistories.findFirst({
		where: and(
			eq(likesToHistories.historyId, data.historyId),
			eq(likesToHistories.userId, data.userId)
		),
	});

	if (likes) {
		await db
			.delete(likesToHistories)
			.where(
				and(
					eq(likesToHistories.historyId, data.historyId),
					eq(likesToHistories.userId, data.userId)
				)
			);
		if (likes.variant == data.variant) {
			return;
		}
	}

	const like = await db.insert(likesToHistories).values(data).returning();
	return like;
};

export const updateCommentHistory = async (data: LikeCommentInsertType) => {
	const likes = await db.query.likeToComments.findFirst({
		where: and(
			eq(likeToComments.commentId, data.commentId),
			eq(likeToComments.userId, data.userId)
		),
	});

	if (likes) {
		await db
			.delete(likeToComments)
			.where(
				and(
					eq(likeToComments.commentId, data.commentId),
					eq(likeToComments.userId, data.userId)
				)
			);
		if (likes.variant == data.variant) {
			return;
		}
	}

	const like = await db.insert(likeToComments).values(data).returning();
	return like;
};

export const updateCommentsCommentHistory = async (
	data: LikeCommentsCommentInsertType
) => {
	const likes = await db.query.likeToCommentComments.findFirst({
		where: and(
			eq(likeToCommentComments.commentsCommentId, data.commentsCommentId),
			eq(likeToCommentComments.userId, data.userId)
		),
	});

	if (likes) {
		await db
			.delete(likeToCommentComments)
			.where(
				and(
					eq(likeToCommentComments.commentsCommentId, data.commentsCommentId),
					eq(likeToCommentComments.userId, data.userId)
				)
			);
		if (likes.variant == data.variant) {
			return;
		}
	}

	const like = await db.insert(likeToCommentComments).values(data).returning();
	return like;
};

export const getSimilarHistory = async (historyId: number) => {
	const similars = await db.query.similarHistories.findMany({
		where: eq(similarHistories.historyId, historyId),
		with: {
			history: true,
			similarHistory: true,
		},
	});
	return similars;
};

export const addSimilarHistory = async (similar: SimilarInsertType) => {
	const createdSimilar = await db
		.insert(similarHistories)
		.values(similar)
		.returning();

	return createdSimilar[0];
};

export const updateSimilarHistoryRate = async ({
	rate,
	similarId,
}: {
	similarId: number;
	rate: number;
}) => {
	const updatedSimilar = await db
		.update(similarHistories)
		.set({ similar: rate })
		.where(eq(similarHistories.id, similarId))
		.returning();

	return updatedSimilar[0];
};
