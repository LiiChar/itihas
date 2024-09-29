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
	generateWallpaper,
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
		console.log(1);

		await generateLayout();
		console.log(2);
		await generateUsers();
		console.log(3);
		await generateWallpaper();
		console.log(4);
		await generateHistory();
		console.log(5);
		await generateBookmarks();
		console.log(10);
		await generateBookmarkToHistory();
		console.log(11);
		await generateCharacters();
		console.log(12);
		await generateCharactersToUsers();
		console.log(13);
		await generateGenre();
		console.log(14);
		await generatePage(pagesContent);
		console.log(15);
		await generatePagePoint(pointsPageContent);
		console.log(16);
		await generateVariable();
		console.log(17);
		await generateComments();
		console.log(18);
		await generateLikePages();
		console.log(19);
		await generateReplyComment();
		console.log(20);
		await generateSimilar();
		console.log(21);
	})();
} catch (error) {
	if (error instanceof Error)
		console.log('Произовашла ошибка по причине: ', error.message);
}
