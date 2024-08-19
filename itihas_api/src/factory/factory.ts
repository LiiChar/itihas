import {
	generateHistory,
	generateGenre,
	generateComments,
	generateSimilar,
} from '../entities/history/history.factory';
import { generatePage, generateVariable } from '../entities/page/page.factory';
import { generateUsers } from '../entities/user/user.factory';

export type StatusFactoryType = {
	status: boolean;
	message: string;
	idx?: number[];
	factory: string;
};

(async () => {
	console.log(`Начало создания`);
	await Promise.all([
		await generateUsers(),
		await generateHistory(),
		await generateGenre(),
		await generatePage(),
		await generateVariable(),
		await generateComments(),
		await generateSimilar(),
	]).then(status => {
		console.log(status);
	});
})();
