import { and, eq } from 'drizzle-orm';
import { db, UserType } from '../../../database/db';
import { variables } from '../model/page';
import { getValueFromStaples, replaceAll } from './string';
import { Signs, getTypeString, getValueByType } from './type';

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
	type:
		| 'move'
		| 'set'
		| 'dif'
		| 'sum'
		| 'mul'
		| 'div'
		| 'var'
		| 'get'
		| 'integer'
		| 'string'
		| 'boolean'
		| 'if'
		| 'query'
		| 'if'
		| 'create';
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
REGEX;

const token: Element[] = [
	{
		regex: /^move\([a-zA-Z0-9А-Яа-я()\[\]{};,]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);
			return {
				type: 'move',
				index,
				value: data,
			};
		},
	},
	{
		regex: /^get\([a-zA-Z0-9А-Яа-я]*\);/,
		getToken: function (value: string): Token {
			const match = value.match(REGEX)!;
			return {
				type: 'get',
				index,
				value: match[1],
			};
		},
	},
	{
		regex: /^query\([a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const match = value.match(REGEX)!;
			return {
				type: 'query',
				index,
				value: match[1],
			};
		},
	},
	{
		regex: /^var\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);

			return {
				type: 'var',
				index,
				value: data.split(','),
			};
		},
	},
	{
		regex: /^dif\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);

			return {
				type: 'dif',
				index,
				value: data.split(','),
			};
		},
	},
	{
		regex: /^sum\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);

			return {
				type: 'sum',
				index,
				value: data.split(','),
			};
		},
	},
	{
		regex: /^div\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);
			return {
				type: 'div',
				index,
				value: data.split(','),
			};
		},
	},

	{
		regex: /^mul\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);
			return {
				type: 'mul',
				index,
				value: data.split(','),
			};
		},
	},
	{
		regex: /^set\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
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
	{
		regex:
			/^create\([a-zA-Z0-9А-Яа-я]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*,[a-zA-Z0-9А-Яа-я()\[\]{};]*\);/,
		getToken: function (value: string): Token {
			const data = getValueFromStaples(value);

			return {
				type: 'set',
				index,
				value: data.split(','),
			};
		},
	},
	{
		regex:
			/^if\({[a-zA-Z0-9А-Яа-я()\[\];]*,(==|>|<|!=|=>|=<),[a-zA-Z0-9А-Яа-я();,]*}{[a-zA-Z0-9А-Яа-я();,]*}{[a-zA-Z0-9А-Яа-я()\[\];,]*}\);/,
		getToken: function (value: string): Token {
			const dataParsed = replaceAll(value, ['}{'], '::');
			const parsed = getValueFromStaples(dataParsed, ['{', '}']);
			const splited = parsed.split('::');
			const data = [...splited.shift()!.split(','), ...splited];
			return {
				type: 'if',
				index,
				value: data,
			};
		},
	},
	{
		regex: /^[0-9]*$/,
		getToken: function (value: string): Token {
			return {
				type: 'integer',
				index,
				value: value,
			};
		},
	},
	{
		regex: /^[a-zA-Z0-9А-Яа-я]*$/,
		getToken: function (value: string): Token {
			return {
				type: 'string',
				index,
				value: value,
			};
		},
	},
	{
		regex: /^(true|false)$/,
		getToken: function (value: string): Token {
			return {
				type: 'boolean',
				index,
				value: value,
			};
		},
	},
];

const execute = (str: string): Token[] => {
	let string = str;
	const tokens: Token[] = [];
	while (string.length > 0) {
		token.forEach(t => {
			if (valid(string, t) && string.length > 0) {
				console.log('Start parse');

				const [newStr, value] = parse(string.trim(), t);
				str = string;
				string = newStr.trim();
				const token = t.getToken(value);
				tokens.push(token);
			}
		});
		if (str == string) {
			throw Error(
				'Не удалост распарсить подходящий токен для кода - ' + string
			);
		}
	}
	return tokens;
};

const run = async (
	tokens: Token[],
	user: UserType,
	id: number,
	varMap?: Map<any, any>,
	isReturn: boolean = false
): Promise<any> => {
	console.log(isReturn ? '' : 'Start run code');

	let pageIndex: number = 0;
	const vars = varMap ?? new Map();
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		if (t.type == 'move') {
			pageIndex = await run(execute(t.value), user, id, vars, true);
		} else if (t.type == 'var') {
			const value = await run(execute(t.value[1]), user, id, vars, true);
			vars.set(t.value[0], value);
		} else if (t.type == 'get') {
			return vars.get(t.value);
		} else if (t.type == 'query') {
			const data = await db.query.variables.findFirst({
				where: and(
					eq(variables.userId, user.id),
					eq(variables.historyId, id),
					eq(variables.variable, t.value as string)
				),
			});
			if (!data) {
				throw Error(
					'action: query, selector: t.value, Not found variable by name'
				);
			}
			return data.data;
		} else if (t.type == 'if') {
			const sign: Signs = t.value[1];
			let leftSide = await run(execute(t.value[0]), user, id, vars, true);
			const leftSideType = getTypeString(leftSide);
			leftSide = getValueByType(leftSide, leftSideType);
			let rightSide = await run(execute(t.value[2]), user, id, vars, true);
			const rightSideType = getTypeString(leftSide);
			rightSide = getValueByType(rightSide, rightSideType);
			const ifAction = t.value[3];
			const elseAction = t.value[4];
			let isTrue: boolean;

			if (sign == '=') {
				isTrue = leftSide == rightSide;
			} else if (sign == '<') {
				isTrue = leftSide < rightSide;
			} else if (sign == '>') {
				isTrue = leftSide > rightSide;
			} else if (sign == '!=') {
				isTrue = leftSide != rightSide;
			} else if (sign == '<=') {
				isTrue = leftSide <= rightSide;
			} else if (sign == '>=') {
				isTrue = leftSide >= rightSide;
			} else {
				isTrue = true;
			}

			if (isTrue) {
				await run(execute(ifAction), user, id, vars, true);
			} else {
				await run(execute(elseAction), user, id, vars, true);
			}
		} else if (t.type == 'set') {
			const data = vars.has(t.value[1]) ? vars.get(t.value[1]) : t.value[1];
			await db
				.update(variables)
				.set({ data })
				.where(
					and(
						eq(variables.userId, user.id),
						eq(variables.historyId, id),
						eq(variables.variable, t.value[0] as string)
					)
				);
		} else if (t.type == 'create') {
			const variableData = {
				data: t.value[1],
				historyId: id,
				userId: user.id,
				type: t.value[2],
				variable: t.value[0],
			};
			await db.insert(variables).values(variableData);
		} else if (t.type == 'sum') {
			const first = vars.get(t.value[0]);
			const second = await run(execute(t.value[1]), user, id, vars, true);
			if (isReturn) {
				return +first + +second;
			}
			vars.set(t.value[0], +first + +second);
		} else if (t.type == 'dif') {
			const first = vars.get(t.value[0]);
			const second = await run(execute(t.value[1]), user, id, vars, true);
			if (isReturn) {
				return +first - +second;
			}
			vars.set(t.value[0], +first - +second);
		} else if (t.type == 'mul') {
			const first = vars.get(t.value[0]);
			const second = await run(execute(t.value[1]), user, id, vars, true);
			if (isReturn) {
				return +first * +second;
			}
			vars.set(t.value[0], +first * +second);
		} else if (t.type == 'div') {
			const first = vars.get(t.value[0]);
			const second = await run(execute(t.value[1]), user, id, vars, true);
			if (isReturn) {
				return +first / +second;
			}
			vars.set(t.value[0], +first / +second);
		} else if (t.type == 'boolean') {
			return t.value;
		} else if (t.type == 'integer') {
			return t.value;
		} else if (t.type == 'string') {
			return t.value;
		}
	}
	return pageIndex;
};

type primary = {
	type: 'sum' | 'mul' | 'div' | 'number' | 'string' | 'boolean';
	variable?: string;
	value: any;
	index: number;
};
