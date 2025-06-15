import { eq, sql } from 'drizzle-orm';
import { updateLikeHistory } from '../../entities/history/history.service';
import { likesToHistories } from '../../database/scheme';
import { socket } from '../..';
import { db } from '../../database/db';

export const handlerHistoryLikeAdd = async ({
	historyId,
	userId,
	value,
}: {
	historyId: number;
	userId: number;
	value: number;
}) => {
	await updateLikeHistory({ historyId, userId, value });
	const historyLikes = await db.query.likesToHistories.findMany({
		where: like => eq(like.historyId, historyId),
		extras: {
			like: sql`avg(${likesToHistories.value})`.as('like'),
		},
	});

	socket
		.to('history:' + historyId)
		.emit(
			'history_like_update',
			Object.assign({ userId, historyId, like: historyLikes[0].like ?? 0 })
		);
};
