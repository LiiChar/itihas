export const getFullUrl = (url: string) => {
	if (url.includes('http')) {
		return url;
	}
	return import.meta.env.VITE_SERVER_URL + url;
};

export const preloadImage = async (url: string) => {
	const objectUrl = await fetch(url)
		.then(response => response.blob())
		.then(image => {
			return URL.createObjectURL(image);
		});
	return objectUrl;
};
