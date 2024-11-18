export const getYear = (dateStr: string): number => {
	const date = new Date(dateStr);
	return date.getFullYear();
};

export const getCurrentDateAtMinute = (minutes: number): string => {
	const allMinutes = new Date().getMinutes() - minutes;
	const date = new Date();
	date.setMinutes(allMinutes);
	// .2024-11-14 16:23:50
	return `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
