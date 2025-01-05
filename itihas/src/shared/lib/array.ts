export function insertBetween<T>(arr: T[], element: T, index: number): T[] {
	return [...arr.slice(0, index), element, ...arr.slice(index)];
}
