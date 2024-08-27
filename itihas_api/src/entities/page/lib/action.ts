import { and, eq } from 'drizzle-orm';
import { db, UserType } from '../../../database/db';
import { variables } from '../model/page';

export const executeAction = async (
	id: number,
	user: UserType,
	action: string
) => {
	const tokens = execute(action.trim());
	const pageId = await run(tokens, user, id);
	return pageId;
};

export type Token = {
	type: 'move' | 'set';
	variable?: string;
	value: any;
	index: number;
};

let index = 0;

const valid = (str: string, { regex }: Element) => {
	return regex.test(str);
};

type Element = {
	regex: RegExp;
	getToken: (value: string) => Token;
};

const parse = (str: string, { regex }: Element) => {
	console.log(str, regex);

	const exec = regex.exec(str)!;
	console.log(exec);

	const lastIndex = (exec[0] ?? exec.input).length;
	index += lastIndex + 1;
	return [str.slice(lastIndex), str.slice(0, lastIndex)];
};

const REGEX = /\(([^)]+)\)/;

const token: Element[] = [
	{
		regex: /^move\([0-9]*\);/,
		getToken: function (value: string): Token {
			const match = value.match(REGEX)!;
			return {
				type: 'move',
				index,
				value: match[1],
			};
		},
	},
	{
		regex: /^set\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{}]*\);/,
		getToken: function (value: string): Token {
			const match = value.matchAll(/\(([^)]+)\)/g)!;
			const values: any[] = [];
			for (const val of match) {
				values.push(val);
			}

			return {
				type: 'set',
				index,
				value: values[0][1].split(','),
			};
		},
	},
];

const execute = (str: string): Token[] => {
	let string = str;
	const tokens: Token[] = [];
	while (string.length > 0) {
		token.forEach(t => {
			console.log('Start validate', str, t, valid(str, t));
			if (valid(string, t)) {
				console.log('Start parse');

				const [newStr, value] = parse(string.trim(), t);
				console.log('old', string);
				console.log('new', newStr);

				string = newStr;
				const token = t.getToken(value);
				tokens.push(token);
			}
		});
		if (str == string) {
			throw Error('Не удалост распарсить action');
		}
	}
	console.log('tokens - ', tokens);

	return tokens;
};

const run = async (tokens: Token[], user: UserType, id: number) => {
	let pageIndex: number = 0;
	tokens.forEach(async t => {
		if (t.type == 'move') {
			pageIndex = t.value;
		} else if (t.type == 'set') {
			console.log(t.value);

			await db
				.update(variables)
				.set({ data: t.value[1] as string })
				.where(
					and(
						eq(variables.userId, user.id),
						eq(variables.historyId, id),
						eq(variables.variable, t.value[0] as string)
					)
				);
		}
	});
	return pageIndex;
};
