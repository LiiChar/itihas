import { access } from 'fs/promises';
import {
	CommentInsertType,
	HistoryInsertType,
	HistoryType,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
	LikeHistoryInsertType,
	LikeHistoryType,
	PageInsertType,
	PageType,
	UserType,
	db,
} from '../../database/db';
import { insertDataToContent } from './lib/content';
import { and, asc, desc, eq, SQL, sql, Table } from 'drizzle-orm';
import {
	comments,
	histories,
	likesToHistories,
	likeToCommentComments,
	likeToComments,
} from './model/history';
import { ErrorBoundary } from '../../lib/error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { socket } from '../..';

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

type Filter = {
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
		const orderResult: any[] = [];
		params.orders?.forEach(({ field, order }) => {
			const orderType = {
				asc: asc,
				desc: desc,
			};
			orderResult.push(orderType[order](table[field as keyof HistoryType]));
		});
		return orderResult;
	};

	let histories = await db.query.histories.findMany({
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
		histories = histories.filter(h => {
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
	return histories;
};

export const getLayouts = async () => {
	const layouts = await db.query.layouts.findMany();
	return layouts;
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
