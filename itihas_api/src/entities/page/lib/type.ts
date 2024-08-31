export const getTypeString = (string: string) => {
	const firstChar = string[0];
	const lastChar = string[string.length - 1];

	if (string === 'true' || string === 'false') return 'boolean';
	if (string === 'null') return 'null';
	if (string === 'undefined') return 'undefined';

	const num = Number(string);
	if (!isNaN(num)) return 'integer';

	if (firstChar === '[' && lastChar === ']') return 'array';
	if (firstChar === '{' && lastChar === '}') return 'object';

	return 'string';
};

export type Signs = '=' | '!=' | '>' | '<' | '<=' | '>=';

export type Types =
	| 'boolean'
	| 'null'
	| 'undefined'
	| 'float'
	| 'integer'
	| 'array'
	| 'object'
	| 'string';

export const getValueByType = (string: string, type: Types): any => {
	if (type == 'integer') {
		return +string;
	} else if (type == 'boolean') {
		return string == 'true' ? true : false;
	} else {
		return string;
	}
};
