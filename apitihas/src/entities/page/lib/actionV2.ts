import { and, eq } from 'drizzle-orm';
import { db, UserType } from '../../../database/db';
import { variables } from '../model/page';
import { getValueFromStaples, replaceAll } from './string';
import { Signs, getTypeString, getValueByType } from './type';
import { ErrorBoundary } from '../../../lib/error';
import { ReasonPhrases } from 'http-status-codes';

export type TokenName =
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

export type Token = {
	token: TokenName;
	children: Token[];
	position: number;
	nested: boolean;
};

export type TokenParse = {
	token: TokenName;
	children: (TokenParse | string)[];
	position: number;
	nested: boolean;
};

type Tokens = Token[];
type TokensParse = TokenParse[];

export const parse = (input: string): Tokens => {
	let result: TokensParse = [];
	const stack: TokensParse = [];
	let currentToken: string = '';
	let position = 0;
	let nested = false;
	let isObjectOrArray = 0;

	for (let char of input) {
		if (char === '(') {
			nested = true;
			stack.push({
				token: currentToken as TokenName,
				children: [],
				nested,
				position,
			});
			currentToken = '';
		} else if (char === ')') {
			if (currentToken) {
				stack[stack.length - 1].children.push(currentToken);
				currentToken = '';
			}

			const lastLevel = stack.pop();
			if (lastLevel && lastLevel.token) {
				if (stack.length > 0) {
					stack[stack.length - 1].children.push(lastLevel);
				} else {
					result.push(lastLevel);
				}
			}
			nested = false;
		} else if (char === ',') {
			if (isObjectOrArray > 0) {
				currentToken += char;
				continue;
			}
			// Запятая - разделитель значений
			if (currentToken) {
				stack[stack.length - 1].children.push(currentToken);
				currentToken = '';
			}
		} else if (char === ';') {
			position += 1;
			continue;
		} else {
			if (char === '{') {
				isObjectOrArray += 1;

				isObjectOrArray += 1;
			} else if (char === '}') {
				isObjectOrArray -= 1;
			} else if (char === '[') {
				isObjectOrArray += 1;
			} else if (char === ']') {
				isObjectOrArray -= 1;
			}
			currentToken += char; // Собираем текущий токен
		}
		position += 1;
	}

	// Обрабатываем оставшийся токен, если он существует
	if (currentToken) {
		if (stack.length > 0) {
			stack[stack.length - 1].children.push(currentToken);
		} else {
			result.push({
				token: currentToken as TokenName,
				children: [],
				nested: nested,
				position,
			});
		}
	}

	result = result.map(t => {
		return changeStringToToken(t);
	});

	return result as Tokens;
};

const changeStringToToken = (token: TokenParse): Token => {
	token.children.forEach((v, i) => {
		if (typeof v == 'string') {
			token.children[i] = {
				token: 'string',
				children: [v],
				nested: true,
				position: token.children[i - 1]
					? (token.children[i - 1] as TokenParse).position + v.length
					: token.position + v.length,
			};
		} else {
			token.children[i] = changeStringToToken(v);
		}
	});
	return token as Token;
};

export const run = async (
	tokens: Token[],
	child: number | null,
	user: UserType,
	id: number,
	varMap?: Map<any, any>,
	isReturn: boolean = false
): Promise<any> => {
	let pageIndex: number = 0;

	const vars = varMap ?? new Map();

	for (let i = child ?? 0; child ? child + 1 : i < tokens.length; i++) {
		const t = tokens[i];
		if (!t) {
			return;
		}
		if (t.token == 'move') {
			pageIndex = await run(t.children, 0, user, id, varMap, isReturn);
		} else if (t.token == 'var') {
			const value = await run(t.children, 1, user, id, vars, true);
			const key = await run(t.children, 0, user, id, vars, true);
			vars.set(key, value);
		} else if (t.token == 'get') {
			const key = await run(t.children, 0, user, id, varMap, isReturn);
			return vars.get(key);
		} else if (t.token == 'query') {
			const data = await db.query.variables.findFirst({
				where: and(
					eq(variables.userId, user.id),
					eq(variables.historyId, id),
					eq(
						variables.variable,
						(await run(t.children, 0, user, id, varMap, isReturn)) as string
					)
				),
			});
			if (!data) {
				throw new ErrorBoundary(
					`action: query, selector: t.value, Not found variable by name`,
					ReasonPhrases.BAD_REQUEST
				);
			}
			return data.data;
		} else if (t.token == 'if') {
			const sign: Signs = await run(t.children, 1, user, id, vars, true);
			let leftSide = await run(t.children, 0, user, id, vars, true);
			const leftSideType = getTypeString(leftSide);
			leftSide = getValueByType(leftSide, leftSideType);
			let rightSide = await run(t.children, 2, user, id, vars, true);
			const rightSideType = getTypeString(leftSide);
			rightSide = getValueByType(rightSide, rightSideType);
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
				await run(t.children, 3, user, id, vars, true);
			} else {
				await run(t.children, 4, user, id, vars, true);
			}
		} else if (t.token == 'set') {
			const value = await run(t.children, 1, user, id, vars, true);
			const key = await run(t.children, 0, user, id, vars, true);
			let data = vars.has(value) ? vars.get(value) : value;

			if (Number.isInteger(data)) {
				data = `${data}`;
			}

			await db
				.update(variables)
				.set({ data })
				.where(
					and(
						eq(variables.userId, user.id),
						eq(variables.historyId, id),
						eq(variables.variable, key as string)
					)
				);
		} else if (t.token == 'create') {
			const data = await run(t.children, 1, user, id, vars, true);
			const type = await run(t.children, 2, user, id, vars, true);
			const variable = await run(t.children, 0, user, id, vars, true);
			const variableData = {
				data,
				historyId: id,
				userId: user.id,
				type,
				variable,
			};
			await db.insert(variables).values(variableData);
		} else if (t.token == 'sum') {
			const key = await run(t.children, 0, user, id, vars, true);
			const first = vars.get(key);
			const second = await run(t.children, 1, user, id, vars, true);

			if (isReturn) {
				return +first + +second;
			}
			vars.set(key, +first + +second);
		} else if (t.token == 'dif') {
			const key = await run(t.children, 0, user, id, vars, true);
			const first = vars.get(key);
			const second = await run(t.children, 1, user, id, vars, true);
			if (isReturn) {
				return +first - +second;
			}
			vars.set(key, +first - +second);
		} else if (t.token == 'mul') {
			const key = await run(t.children, 0, user, id, vars, true);
			const first = vars.get(key);
			const second = await run(t.children, 1, user, id, vars, true);
			if (isReturn) {
				return +first * +second;
			}
			vars.set(key, +first * +second);
		} else if (t.token == 'div') {
			const key = await run(t.children, 0, user, id, vars, true);
			const first = vars.get(key);
			const second = await run(t.children, 1, user, id, vars, true);
			if (isReturn) {
				return +first / +second;
			}
			vars.set(key, +first / +second);
		} else if (t.token == 'boolean') {
			return t.children[0];
		} else if (t.token == 'integer') {
			return t.children[0];
		} else if (t.token == 'string') {
			return t.children[0];
		}
	}
	return pageIndex;
};
