const backgroundImage = [
	'beach',
	'beachshore',
	'city',
	'dampcave',
	'deepsea',
	'desert',
	'earthycave',
	'forest',
	'icecave',
	'meadow',
	'mountain',
	'river',
	'route',
	'space',
	'spl',
	'thinderplaintns',
	'valcanocave',
];

export const getRandomBackgroundImage = () => {
	return backgroundImage[Math.ceil(Math.random() * backgroundImage.length)];
};
