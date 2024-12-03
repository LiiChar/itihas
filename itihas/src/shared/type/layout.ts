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
	type: 'image' | 'points' | 'content' | 'block' | 'list' | 'video' | 'action';
	align?: 'center' | 'left' | 'right' | 'bottom' | 'top';
	option: {
		list_variable: string;
		list_element_variable: string;
		list_type: 'default' | 'dialog';
		list_dialog_sort: string;
		src: string;
		autoplay: boolean;
		volume: number;
		script: string;
	};
	style: string;
	children?: LayoutComponent[];
	variables: LayoutContentVariable[];
};

export type LayoutContentVariable = {
	key: string;
	value: string;
};
