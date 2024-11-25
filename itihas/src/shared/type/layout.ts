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
	type: 'image' | 'points' | 'content' | 'dialog' | 'custom';
	align: 'center' | 'left' | 'right';
	style: string;
	content: null | LayoutContent;
};

export type LayoutContent = {
	value: string | Record<string, LayoutContent> | LayoutContent[];
	style: string;
	type?: 'list' | 'object' | 'row';
	variable: LayoutContentVariable[];
};

export type LayoutContentVariable = {
	key: string;
	value: string;
};
