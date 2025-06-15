export const getValueFromStaples = (string: string, staple = ['(', ')']) => {
	const letfStapleIndex = string.indexOf(staple[0]) + 1;
	const rightStapleIndex = string.lastIndexOf(staple[1]);

	return string.slice(letfStapleIndex, rightStapleIndex);
};

export const getValueWithoutStaples = (string: string, staple: string[]) => {
	const regex = new RegExp(
		`${staple.length === 1 ? staple : staple.join(' | ')}`,
		'g'
	);
	string = string.replace(regex, '');
	return string;
};

const REGEX = /\(([^)]+)\)/;

export const replaceAll = (string: string, staple: string[], value: string) => {
	const regex = new RegExp(
		`${staple.length === 1 ? staple : staple.join(' | ')}`,
		'g'
	);
	string = string.replace(regex, value);
	return string;
};

let index = 0;

type Element = {
	regex: RegExp;
	getToken: (value: string) => Token;
};

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
				type: 'create',
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

const parse = (str: string, { regex }: Element) => {
	const exec = regex.exec(str)!;
	const lastIndex = (exec[0] ?? exec.input).length;
	index += lastIndex + 1;
	return [str.slice(lastIndex), str.slice(0, lastIndex)];
};

const execute = (str: string): Token[] => {
	let string = str;
	const tokens: Token[] = [];
	while (string.length > 0) {
		token.forEach(t => {
			if (valid(string, t) && string.length > 0) {
				const [newStr, value] = parse(string.trim(), t);
				str = string;
				string = newStr.trim();
				const token = t.getToken(value);


				if (Array.isArray(token.value) && token.type == 'if') {
					token.value[0] = execute(token.value[0]);
					token.value[2] = execute(token.value[2]);
					token.value[3] = execute(token.value[3]);
					token.value[4] = execute(token.value[4]);
				}
				if (
					!Array.isArray(token.value) &&
					token.type != 'boolean' &&
					token.type != 'integer' &&
					token.type != 'string'
				) {
					token.value = execute(token.value);
				}
				tokens.push(token);
			}
		});
		if (str == string) {
			throw Error(`${string}::${index}`);
		}
	}
	return tokens;
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
const valid = (str: string, { regex }: Element) => {
	return regex.test(str);
};

/*
 move(id) - переместиться на другую старницу 
 set(key,value) - сохрание данных в пределах всеё истории
 get(key) - получение данных в пределах одного процесса
 query(key) - получение данных в пределах всей истории
 var(key,value) - сохранить данные в пределах одного процесса
 sum(v1,v2) - суммирование значения с сохранением в перове значение
 dif(v1,v2) - уменьшение занчения с сохранениям в перове значение
 mul(v1,v2) - умножение значение с похранениев перове значение
 div(v1,v2) - деление значение с похранениев перове значение
 create(key,value,type) - созадние переменной во всей истории
 if(v1,v2,r1,r2) условие выполнения функционала
*/
