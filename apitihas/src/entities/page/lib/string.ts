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

export const replaceAll = (string: string, staple: string[], value: string) => {
	const regex = new RegExp(
		`${staple.length === 1 ? staple : staple.join(' | ')}`,
		'g'
	);
	string = string.replace(regex, value);
	return string;
};
