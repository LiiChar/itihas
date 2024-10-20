export type Component = {
	type: 'image' | 'points' | 'content' | 'custom';
	align: 'center' | 'left' | 'right';
	style: string;
	content: null | string;
};

export type layoutComponents = Component[];
