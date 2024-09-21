import {
	generateHistory,
	generateGenre,
	generateComments,
	generateSimilar,
} from '../entities/history/history.factory';
import {
	generatePage,
	generateVariable,
	generatePagePoint,
	generateWallpaper,
	generateLayout,
} from '../entities/page/page.factory';
import { generateUsers } from '../entities/user/user.factory';
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
		await Promise.all([
			await generateLayout(),
			await generateUsers(),
			await generateWallpaper(),
			await generateHistory(),
			await generateGenre(),
			await generatePage(pagesContent),
			await generatePagePoint(pointsPageContent),
			await generateVariable(),
			await generateComments(),
			await generateSimilar(),
		]).then(status => {
			console.log(status);
		});
	})();
} catch (error) {
	if (error instanceof Error)
		console.log('Произовашла ошибка по причине: ', error.message);
}
