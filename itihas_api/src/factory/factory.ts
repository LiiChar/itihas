import {
	generateHistory,
	generateGenre,
	generateComments,
	generateSimilar,
	generateReplyComment,
	generateCharacters,
	generateBookmarkToHistory,
} from '../entities/history/history.factory';
import {
	generatePage,
	generateVariable,
	generatePagePoint,
	generateLayout,
	generateBookmarks,
	generateLikePages,
} from '../entities/page/page.factory';
import {
	generateUsers,
	generateCharactersToUsers,
} from '../entities/user/user.factory';
import { pagesContent, pointsPageContent } from './content/page';

export type StatusFactoryType = {
	status: boolean;
	message: string;
	idx?: number[];
	factory: string;
};

try {
	(async () => {
		console.log(`Начало создания`);
		console.log(1, ' Генерация расположений контента');
		await generateLayout();
		console.log(2, ' Генерация пользователей');
		await generateUsers();
		console.log(3, ' Генерация история');
		await generateHistory();
		console.log(4, ' Генерация закладок');
		await generateBookmarks();
		console.log(5, ' Генерация закладок к историям');
		await generateBookmarkToHistory();
		console.log(6, ' Генерация персонажей');
		await generateCharacters();
		console.log(7, ' Генерация персонажей к историям');
		await generateCharactersToUsers();
		console.log(8, ' Генерация жанров');
		await generateGenre();
		console.log(9, ' Генерация страниц');
		await generatePage(pagesContent);
		console.log(10, ' Генерация пунктов выбора историй');
		await generatePagePoint(pointsPageContent);
		console.log(11, ' Генерация параметров');
		await generateVariable();
		console.log(12, ' Генерация комментариев');
		await generateComments();
		console.log(13, ' Генерация лайков к страницам');
		await generateLikePages();
		console.log(14, ' Генерация ');
		await generateReplyComment();
		console.log(15, ' Генерация похожих историй');
		await generateSimilar();
	})();
} catch (error) {
	if (error instanceof Error)
		console.log('Произовашла ошибка по причине: ', error.message);
}
