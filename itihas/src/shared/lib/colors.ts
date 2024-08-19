export const hslToHex = (hsl: string) => {
	hsl = hsl.replaceAll('hst(', '').replaceAll(')', '').replaceAll('%', '');
	let [h, s, l] = hsl.split(' ').map(el => Number(el));
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0'); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
};

export const addAlphaHex = (color: string, opacity: number) => {
	// coerce values so ti is between 0 and 1.
	var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
	return color + _opacity.toString(16).toUpperCase();
};
