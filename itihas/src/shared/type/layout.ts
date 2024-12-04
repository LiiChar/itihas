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
	content?: string;
	option?: {
		list?: {
			list_variable?: string;
			list_type?: 'list' | 'dialog';
			dialog?: {
				dialog_name_variable?: string;
				dialog_message_variable?: string;
				dialog_action_variable?: string;
			};
			list?: {
				list_element_variable?: string;
			};
		};
		media?: {
			src?: string;
			image?: {};
			video?: {
				autoplay?: boolean;
				volume?: number;
			};
		};
		action?: {
			script?: string;
		};
		text?: {
			text_variable?: string;
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
