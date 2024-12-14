export const getFullUrl = (url: string) => {
	if (url && url.includes('http')) {
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

export const handleImageError = (
	{ currentTarget }: React.SyntheticEvent<HTMLImageElement, Event>,
	_url?: string,
	cb?: () => void
) => {
	currentTarget.onerror = null;
	// currentTarget.style.objectFit = 'cover';
	currentTarget.src = '/public/not_found_flower.jpg';
	cb && cb();
};
