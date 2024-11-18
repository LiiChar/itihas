import { like, or, sql } from 'drizzle-orm';
import { db } from '../../../database/db';
import { histories } from '../../history/model/history';
import { pages } from '../../page/model/page';

export const search = async (search: string) => {
	const searchedValue: Record<string, any> = {};

	const historySearched = await db.query.histories.findMany({
		where: or(
			like(histories.name, `%${search}%`),
			like(histories.description, `%${search}%`)
		),
	});

	searchedValue.history = historySearched;

	const pagesSearched = await db.query.pages.findMany({
		where: or(
			sql`to_tsvector('simple', ${pages.name}) @@ to_tsquery('simple', ${search})`,
			sql`to_tsvector('simple', ${pages.description}) @@ to_tsquery('simple', ${search})`
		),
	});

	searchedValue.page = pagesSearched;
	return searchedValue;
};
