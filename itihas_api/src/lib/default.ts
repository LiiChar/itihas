import { BookmarkInsertType, db } from '../database/db';
import { bookmarks } from '../entities/history/model/history';

export const createDefaulBookmarks = async (userId: number) => {
	const defaultBookmark: BookmarkInsertType[] = [
		{
			name: 'Читаю',
			userId: userId,
		},
		{
			name: 'Буду читать',
			userId: userId,
		},
		{
			name: 'Заброшено',
			userId: userId,
		},
		{
			name: 'Прочитано',
			userId: userId,
		},
		{
			name: 'Любимое',
			userId: userId,
		},
	];
	const array = defaultBookmark;

	try {
		const idx: number[] = [];
		array.forEach(async data => {
			const { id } = (await db.insert(bookmarks).values(data).returning())[0];
			idx.push(id);
		});
		return idx;
	} catch (error) {
		if (error instanceof Error) {
			console.log('Произошла ошибка при создании дефолныз закладок');
		}
	}
};
