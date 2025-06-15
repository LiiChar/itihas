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
	type:
		| 'image'
		| 'points'
		| 'content'
		| 'block'
		| 'list'
		| 'video'
		| 'action'
		| 'text';
	align?: ('center' | 'left' | 'right' | 'bottom' | 'top')[];
	content: string;
	elementStyle?: string;
	visible?: boolean;
	option?: {
		image?: {
			alt?: string;
			title?: string;
		};
		action?: {
			title?: string;
			moved?: string;
		};
		video?: {
			autoplay?: boolean;
			volume?: number;
			alt?: string;
			title?: string;
		};
	};
	style?: string;
	children?: LayoutComponent[];
	variables?: LayoutContentVariable[];
};

export type LayoutContentVariable = {
	key: string;
	value: string;
};
