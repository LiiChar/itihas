import { and, eq, or } from 'drizzle-orm';
import { BookmarkType, db, UserType } from '../../database/db';
import {
	bookmarkHistoryInsertSchemaType,
	bookmarkInsertSchemaType,
} from './bookmark.scheme';
import { bookmarks } from './model/bookmark';
import { bookmarksToHistories } from '../history/model/history';

export const getListBookmarks = async (userId: number) => {
	let bookmarks = await db.query.bookmarks.findMany({
		where: b => eq(b.userId, userId),
	});

	return bookmarks;
};

export const getBookmarks = async (userId: number, bookmarkType?: string) => {
	let bookmarks = await db.query.bookmarks.findMany({
		where: b =>
			bookmarkType
				? and(eq(b.name, bookmarkType), eq(b.userId, userId))
				: eq(b.userId, userId),
		with: {
			histories: {
				with: {
					history: {
						with: {
							genres: true,
						},
					},
				},
			},
		},
	});

	if (bookmarks.length == 0 && bookmarkType) {
		bookmarks = await db.query.bookmarks.findMany({
			where: b => eq(b.userId, userId),
			with: {
				histories: {
					with: {
						history: {
							with: {
								genres: true,
							},
						},
					},
				},
			},
		});
	}

	return bookmarks;
};

export const deleteBookmarkById = async (bookmarkId: number) => {
	await db
		.delete(bookmarksToHistories)
		.where(eq(bookmarksToHistories.id, bookmarkId));
};

export const createBookmark = async (
	bookmarkData: bookmarkInsertSchemaType
) => {
	const bookmark = await db.insert(bookmarks).values(bookmarkData).returning();
	return bookmark[0];
};

export const addHistoryToBookmark = async (
	bookmarkHistoryData: bookmarkHistoryInsertSchemaType & { user?: UserType }
) => {
	const existBookmarkHistory = await db.query.bookmarks.findMany({
		where: (bk, { eq }) => eq(bk.userId, bookmarkHistoryData.user!.id),
	});

	await db
		.delete(bookmarksToHistories)
		.where(
			and(
				or(
					...existBookmarkHistory.map(b =>
						eq(bookmarksToHistories.bookmarkId, b.id)
					)
				),
				eq(bookmarksToHistories.historyId, bookmarkHistoryData.historyId)
			)
		);

	const bookmark = await db
		.insert(bookmarksToHistories)
		.values(bookmarkHistoryData)
		.returning();
	return bookmark[0];
};
