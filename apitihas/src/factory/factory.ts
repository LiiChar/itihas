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
import { genresContent } from './content/genres';
import { historyContent } from './content/history';
import { LayoutContent } from './content/layout';
import { pagesContent, pointsPageContent } from './content/page';
import { VariableContent } from './content/variable';

export type StatusFactoryType = {
	status: boolean;
	message: string;
	idx?: number[];
	factory: string;
};

try {
	(async () => {
		console.log(`Начало создания`);
		console.log(1, ' Генерация пользователей');
		await generateUsers();
		console.log(2, ' Генерация расположений контента');
		await generateLayout(LayoutContent);
		console.log(3, ' Генерация история');
		const history = await generateHistory(historyContent);
		console.log(4, ' Генерация закладок');
		await generateBookmarks();
		console.log(5, ' Генерация закладок к историям');
		await generateBookmarkToHistory();
		console.log(6, ' Генерация персонажей');
		await generateCharacters();
		console.log(7, ' Генерация персонажей к историям');
		await generateCharactersToUsers();
		console.log(8, ' Генерация жанров');
		await generateGenre(genresContent);
		console.log(9, ' Генерация страниц');
		await generatePage(pagesContent);
		console.log(10, ' Генерация пунктов выбора историй');
		await generatePagePoint(pointsPageContent);
		console.log(11, ' Генерация параметров');
		await generateVariable(VariableContent);
		console.log(12, ' Генерация комментариев');
		await generateComments();
		console.log(13, ' Генерация лайков к страницам');
		await generateLikePages();
		console.log(14, ' Генерация комментариев');
		await generateReplyComment();
		console.log(15, ' Генерация похожих историй');
		await generateSimilar(history.idx ?? []);
	})();
} catch (error) {
	if (error instanceof Error)
		console.log('Произовашла ошибка по причине: ', error.message);
}
