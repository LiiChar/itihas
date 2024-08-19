export const getYear = (dateStr: string): number => {
	const date = new Date(dateStr);
	return date.getFullYear();
};
