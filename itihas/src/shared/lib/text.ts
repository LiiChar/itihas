export const clearTextQuota = (text: string) => {
	text = text.replace(/^./, '');
	text = text.replace(/^'/, '');
	text = text.replace(/'$/, '');
	text = text.replace(/^"/, '');
	text = text.replace(/"$/, '');
	text = text.replace(/^«/, '');
	text = text.replace(/»$/, '');
	return text;
};

export const formatData = (obj: any, indent = 0) => {
	const indentString = '  '.repeat(indent);
	let output = '';

	if (Array.isArray(obj)) {
		output += '[\n';
		for (let i = 0; i < obj.length; i++) {
			const value = obj[i];
			if (typeof value === 'object' && value !== null) {
				output += formatData(value, indent + 1);
			} else {
				output +=
					indentString +
					'  ' +
					JSON.stringify(value) +
					(i === obj.length - 1 ? '' : ',') +
					'\n';
			}
		}
		output += indentString + ']\n';
	} else if (typeof obj === 'object' && obj !== null) {
		output += '{\n';
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = obj[key];
			if (typeof value === 'object' && value !== null) {
				output += indentString + '  ' + JSON.stringify(key) + ': ';
				output += formatData(value, indent + 1);
			} else {
				output +=
					indentString +
					'  ' +
					JSON.stringify(key) +
					': ' +
					JSON.stringify(value) +
					(i === keys.length - 1 ? '' : ',') +
					'\n';
			}
		}
		output += indentString + '}\n';
	} else {
		output += indentString + JSON.stringify(obj) + '\n';
	}

	return output;
};

export const minifyData = (obj: any): string => {
	if (
		typeof obj === 'string' ||
		typeof obj === 'number' ||
		typeof obj === 'boolean' ||
		obj === null
	) {
		return JSON.stringify(obj);
	} else if (Array.isArray(obj)) {
		return `[${obj.map(minifyData).join(',')}]`;
	} else if (typeof obj === 'object' && obj !== null) {
		const keys = Object.keys(obj);
		return `{${keys
			.map((key: any) => `${JSON.stringify(key)}:${minifyData(obj[key])}`)
			.join(',')}}`;
	}
	return ''; //  Для неизвестных типов
};

export const formatJSON = () => {};

export function replaceMoveValue(
	inputString: string,
	newValue: string
): string {
	// Регулярное выражение для поиска 'move(...)', где "..." может содержать другие скобки
	const pattern = /move\(([^()]*|\((?:[^()]*|\([^()]*\))*\))*\);/g;

	// Замена значения внутри скобок
	const newString = inputString.replace(pattern, newValue);

	return newString;
}
