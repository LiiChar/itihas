import {
	CommentType,
	GenreType,
	HistoryInsertType,
	HistoryType,
	LayoutType,
	LikeCommentInsertType,
	LikeCommentsCommentInsertType,
	LikeHistoryInsertType,
	SimilarInsertType,
	UserType,
	db,
} from '../../database/db';
import { insertDataToContent } from './lib/content';
import { and, asc, desc, eq, inArray, or, SQL, sql } from 'drizzle-orm';
import {
	comments,
	genresToHistories,
	histories,
	likesToHistories,
	likeToCommentComments,
	likeToComments,
	similarHistories,
} from './model/history';
import { ErrorBoundary } from '../../lib/error';
import { ReasonPhrases } from 'http-status-codes';
import { layouts } from '../page/model/page';
import { HistoryInsertSchema } from './history.scheme';

export const getHistory = async (id: number, user?: UserType) => {
	const history = await db.query.histories.findFirst({
		extras: {
			views: sql<number>`lower(0)`.as('views'),
		},
		where: (histories, { eq }) => eq(histories.id, id),
		orderBy: (histories, { desc }) => [desc(histories.createdAt)],
		with: {
			author: true,
			characters: true,
			likes: true,
			comments: {
				with: {
					user: true,
					likes: true,
					comments: {
						orderBy: (comments, { desc }) => [desc(comments.createdAt)],
					},
				},
				orderBy: (comments, { desc }) => [desc(comments.createdAt)],
			},
			similarHistories: {
				with: {
					similarHistory: true,
				},
				// orderBy: (sim, { desc }) => [desc(sim.similar)],
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
	if (user) {
		const promises = history.pages.reduce<any[]>((acc: any, page: any) => {
			history['views'] = +history['views'] + page.views;
			acc.push(insertDataToContent(page.content, history.id, user.id));
			return acc;
		}, []);
		const contents = await Promise.all(promises);
		contents.forEach((c: any, i: number) => {
			history.pages[i].content = c;
		});
	}

	return history;
};

export const createHistory = async (data: HistoryInsertSchema) => {
	const existHistory = await db.query.histories.findFirst({
		where: eq(histories.name, data.name),
	});

	const genresIds = [...(data.genres ?? [])];

	const historyData = data as HistoryInsertType;

	if (existHistory) {
		throw new ErrorBoundary(
			'История с таким названием уже существует',
			ReasonPhrases.BAD_REQUEST
		);
	}

	const history = await db.insert(histories).values(historyData).returning();

	if (history[0]) {
		genresIds.forEach(async id => {
			await db.insert(genresToHistories).values({
				genreId: id,
				historyId: history[0].id,
			});
		});
	}

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
	userId?: number;
};

export const getHistories = async (params: Params) => {
	// 👉 Построение WHERE-фильтров
	function buildWhereClause(filters: Filter[], table: any): SQL {
		const replacesField: Record<string, string> = {
			genre: 'name',
		};

		const buildFilter = (filter: Filter): SQL => {
			const clauses: SQL[] = [];

			if (filter.field && filter.value && filter.operator) {
				const field = replacesField[filter.field] ?? filter.field;
				if (!(field in table)) {
					throw new ErrorBoundary(
						`Field ${field} not in table`,
						ReasonPhrases.BAD_REQUEST
					);
				}

				const column = table[field];
				const value = sql.raw(`'${filter.value}'`);
				clauses.push(sql`${column} ${sql.raw(filter.operator)} ${value}`);
			}

			if (filter.innerFilters?.length) {
				const inner = filter.innerFilters.map(buildFilter);
				const conjunction =
					filter.variant === 'or' ? sql.raw(' OR ') : sql.raw(' AND ');
				clauses.push(sql.join(inner, conjunction));
			}

			return sql.join(clauses, sql.raw(' AND '));
		};

		return sql.join(filters.map(buildFilter), sql.raw(' AND '));
	}

	const whereBuilder = (table: any) => {
		if (!params.filter?.length) return undefined;
		return buildWhereClause(params.filter, table);
	};

	// 👉 Построение ORDER BY
	const orderBuilder = (table: any) => {
		const orders: SQL[] = [];

		params.orders?.forEach(({ field, order }) => {
			const col = table[field];
			if (!col) return;
			orders.push(order === 'desc' ? desc(col) : asc(col));
		});

		return orders;
	};

	// 👉 Основной запрос
	let historiesFiltered = await db.query.histories.findMany({
		with: {
			genres: { with: { genre: true } },
			// tags: { with: { tag: true } },
			likes: true,
		},
		limit: params.limit,
		offset: params.offset,
		orderBy: history => orderBuilder(history),
		where: history => whereBuilder(history),
	});

	// 👉 Подсчёт лайков
	historiesFiltered = historiesFiltered.map(h => {
		const sum = h.likes.reduce((acc, l) => acc + (l.value ?? 0), 0);
		const avg = h.likes.length ? sum / h.likes.length : 0;
		return { ...h, like: avg };
	});

	// 👉 Фильтрация по жанрам
	if (params.genres?.length) {
		historiesFiltered = historiesFiltered.filter(h => {
			return params.genres!.some(g =>
				h.genres.some(gg => gg.genre.name === g.genre && g.allow === 'true')
			);
		});
	}

	// 👉 Фильтрация по тегам
	// if (params.tags?.length) {
	// 	historiesFiltered = historiesFiltered.filter(h => {
	// 		return params.tags!.some(t =>
	// 			h.tags.some(tt => tt.tag.name === t.tag && t.allow === 'true')
	// 		);
	// 	});
	// }

	// 👉 Обработка закладок
	if (params.userId) {
		const user = await db.query.users.findFirst({
			where: u => eq(u.id, params.userId!),
			with: {
				bookmarks: { with: { histories: true } },
			},
		});

		if (user) {
			const historyToBookmark: Record<number, string> = {};
			for (const bookmark of user.bookmarks) {
				for (const h of bookmark.histories) {
					historyToBookmark[h.historyId] = bookmark.name;
				}
			}

			historiesFiltered = historiesFiltered.map(h => ({
				...h,
				bookmark: historyToBookmark[h.id] ?? undefined,
			}));
		}
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
	updatedData: Partial<
		HistoryType & { genres?: { genre: GenreType }[] } & {
			comments?: CommentType[];
		}
	>
) => {
	if (updatedData.genres?.length) {
		const incomingGenreIds = updatedData.genres.map(g => g.genre.id);

		// Получаем текущие связи
		const existing = await db
			.select({
				genreId: genresToHistories.genreId,
			})
			.from(genresToHistories)
			.where(eq(genresToHistories.historyId, id));

		const existingGenreIds = new Set(existing.map(e => e.genreId));
		const incomingGenreIdSet = new Set(incomingGenreIds);

		// Найти жанры, которые нужно удалить
		const toDelete = [...existingGenreIds].filter(
			id => !incomingGenreIdSet.has(id)
		);

		// Найти жанры, которые нужно добавить
		const toInsert = incomingGenreIds.filter(id => !existingGenreIds.has(id));

		// Удалить лишние связи
		if (toDelete.length) {
			await db
				.delete(genresToHistories)
				.where(
					and(
						eq(genresToHistories.historyId, id),
						inArray(genresToHistories.genreId, toDelete)
					)
				);
		}

		// Добавить недостающие связи
		if (toInsert.length) {
			await db.insert(genresToHistories).values(
				toInsert.map(genreId => ({
					genreId,
					historyId: id,
				}))
			);
		}
	}

	if (updatedData.comments?.length) {
		const incomingComments = updatedData.comments;

		// Получаем все комментарии из БД по этим ID истории
		const existingComments = await db
			.select({
				id: comments.id,
				content: comments.content,
			})
			.from(comments)
			.where(eq(comments.historyId, id)); // предполагаем, что у комментария есть historyId

		const existingMap = new Map(existingComments.map(c => [c.id, c.content]));
		const incomingMap = new Map(incomingComments.map(c => [c.id, c.content]));

		// ID всех входящих
		const incomingIds = new Set(incomingComments.map(c => c.id));

		// 1. Удаляем те комментарии, которых нет во входящих
		const toDelete = existingComments
			.filter(c => !incomingIds.has(c.id))
			.map(c => c.id);

		if (toDelete.length) {
			await db.delete(comments).where(inArray(comments.id, toDelete));
		}

		function normalizeText(text: string): string {
			return text
				.replace(/\r\n/g, '\n') // приводим все переводы строк к одному виду
				.trim(); // убираем пробелы в начале и конце
		}

		const toUpdate = incomingComments.filter(c => {
			const existingContent = existingMap.get(c.id);
			if (existingContent === undefined) return false;

			return normalizeText(existingContent) !== normalizeText(c.content);
		});

		for (const c of toUpdate) {
			await db
				.update(comments)
				.set({ content: c.content })
				.where(eq(comments.id, c.id));
		}
	}

	const updatedHistory = await db
		.update(histories)
		.set(updatedData)
		.where(eq(histories.id, id))
		.returning();
	return updatedHistory[0];
};

export const updateLikeHistory = async (data: LikeHistoryInsertType) => {
	const likeExist = await db.query.likesToHistories.findFirst({
		where: and(
			eq(likesToHistories.historyId, data.historyId),
			eq(likesToHistories.userId, data.userId)
		),
	});

	if (!likeExist) {
		await db.insert(likesToHistories).values(data);
	} else {
		await db.update(likesToHistories).set({ value: data.value });
	}

	const like = await db.query.likesToHistories.findFirst({
		where: and(
			eq(likesToHistories.historyId, data.historyId),
			eq(likesToHistories.userId, data.userId)
		),
	});

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
	const exists = await db
		.select()
		.from(similarHistories)
		.where(
			and(
				eq(similarHistories.historyId, similar.historyId),
				eq(similarHistories.similarHistoryId, similar.similarHistoryId)
			)
		)
		.limit(1);

	if (exists.length > 0) {
		return exists[0];
	}

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
