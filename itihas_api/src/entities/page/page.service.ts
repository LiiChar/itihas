import { access } from 'fs/promises';
import { PageInsertType, PageType, UserType, db } from '../../database/db';
import { insertDataToContent } from './lib/content';
import { eq, sql } from 'drizzle-orm';
import { pagePoints, pages } from './model/page';
import { histories } from '../history/model/history';

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

	return pagesWithVariables;
};

export const executeActionPage = async (
	id: number,
	action: number,
	user: UserType
) => {};
