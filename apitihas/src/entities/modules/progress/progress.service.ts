import { db } from '../../../database/db';

export const getProgress = async ({
	historyId,
	pageId,
	userId,
}: {
	userId?: number;
	pageId?: number;
	historyId?: number;
}) => {
	const progreses = await db.query.userHistoryProgreses.findMany({
		where: (progress, { eq, and }) => {
			let first;
			if (historyId) {
				first = eq(progress.historyId, historyId);
			}
			let second;
			if (pageId) {
				second = eq(progress.pageId, pageId);
			}
			let third;
			if (userId) {
				third = eq(progress.userId, userId);
			}
			return and(first, second, third);
		},
		with: {
			page: true,
			history: true,
			user: true,
			nextPage: true,
			prevPage: true,
		},
	});

	return progreses;
};
