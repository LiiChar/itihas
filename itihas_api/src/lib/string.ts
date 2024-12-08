function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
export const multiplyString = (
	str: string,
	count: number,
	separator?: string
) => {
	let value = '';
	for (let i = 0; i < count; i++) {
		value += str + separator;
	}
	return value;
};
