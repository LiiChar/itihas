import { Request, Response, Router } from 'express';

const gigaChatRouter = Router();

let token = '';

gigaChatRouter.get('/', async (req: Request, res: Response) => {
	const secretKey =
		'MDlkNmVlMWEtNDJiZC00ZjFjLWEwZTMtMGViNjFjNWNmMGJmOmM4OTg1YThiLTUxODQtNDI1YS1iMzMwLTZhODY3OWI5OTUwOQ==';
	const clientId = '09d6ee1a-42bd-4f1c-a0e3-0eb61c5cf0bf';
	const scope = 'GIGACHAT_API_PERS';
	if (token == '') {
		token = await (
			await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
				method: 'POST',
				body: JSON.stringify({
					scope: scope,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
					RqUID: clientId,
					Authorization: `Basic ${secretKey}`,
				},
			})
		).json();
		console.log(token);
	}
});
