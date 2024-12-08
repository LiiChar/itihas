export const getTypeFromValue = (data: unknown) => {
	if (Array.isArray(data)) {
		return 'array';
	}
	if (typeof data == 'object') {
		return 'object';
	}
	if (Number.isInteger(data)) {
		return 'number';
	}
	return 'string';
};
