export function insertBetween<T>(arr: T[], element: T, index: number): T[] {
	return [...arr.slice(0, index), element, ...arr.slice(index)];
}

export function splitColumnArray<T>(arr: T[], gap: number): T[][] {
	const lenCol = arr.length / gap;
	const result: T[][] = [];

	for (let i = 0; i < gap; i++) {
		result.push(arr.slice(i * lenCol, (i + 1) * lenCol));
	}

	return result;
}
