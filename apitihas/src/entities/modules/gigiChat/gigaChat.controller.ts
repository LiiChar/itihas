import { Request, Response, Router } from 'express';
import { GigaChat } from 'gigachat-node';
import { StatusCodes } from 'http-status-codes';

const gigaChatRouter = Router();

let token = '';

gigaChatRouter.post('/', async (req: Request, res: Response) => {
	const question = req.body.question;
	if (!question || question == '') {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Question not request' });
	}
	const client = new GigaChat(
		'MDlkNmVlMWEtNDJiZC00ZjFjLWEwZTMtMGViNjFjNWNmMGJmOmM4OTg1YThiLTUxODQtNDI1YS1iMzMwLTZhODY3OWI5OTUwOQ==',
		true,
		true,
		true
	);
	await client.createToken();
	const responce = await client.completion({
		model: 'GigaChat:latest',
		messages: [
			{
				role: 'user',
				content: question,
			},
		],
	});
	return res.json(responce);
});

export { gigaChatRouter };
