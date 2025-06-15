export const sleep = async (ms: number = 0) => {
	await new Promise(resolve => setTimeout(resolve, ms));
};
