export type Layout = {
	name: string;
	layout: LayoutComponent[];
	id?: number | undefined;
	description?: string | null | undefined;
	createdAt?: string | undefined;
	rate?: number | undefined;
	updatedAt?: string | undefined;
};

export type LayoutComponent = {
	type: 'image' | 'points' | 'content' | 'custom';
	align: 'center' | 'left' | 'butten';
	style: string;
	content: null | string;
};
