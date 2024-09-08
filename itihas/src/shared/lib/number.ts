export const percentageOf = (full: number, percent: number) => {
	return Math.floor((percent / full) * 100);
};

export const clamp = (min: number, value: number, max: number) => {
	return Math.max(Math.min(value, max), min);
};
