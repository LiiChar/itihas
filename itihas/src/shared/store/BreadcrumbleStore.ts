import { useEffect } from 'react';
import { create } from 'zustand';

export interface BreadcrumbleStore {
	breadcruble: [];
}

type Breadcrumble = {
	path: string;
	value: string;
	vars?: string[];
	children: BreadcrumbleChildren;
};

type BreadcrumbleChildren = Breadcrumble[];

const defaultValue: BreadcrumbleChildren = [
	{
		path: '/',
		value: 'Главная',
		children: [
			{
				path: '/library',
				value: 'Библиотека',
				children: [],
			},
			{
				path: '/profile',
				value: 'Страница пользователя',
				children: [
					{
						path: '/profile/[profileId]',
						value: 'Страница пользователя',
						vars: ['profileId'],
						children: [],
					},
				],
			},
			{
				path: '/history',
				value: 'Истории',
				children: [
					{
						path: '/history/[historyId]',
						value: 'История',
						vars: ['historyId'],
						children: [
							{
								path: '/history/:historyId/read',
								value: 'Читать',
								children: [],
							},
							{
								path: '/history/:historyId/edit',
								value: 'Редактировать',
								children: [],
							},
							{
								path: '/history/:historyId/page',
								value: 'Страницы',
								children: [
									{
										path: '/history/:historyId/page/edit',
										value: 'Страницы',
										children: [],
									},
								],
							},
						],
					},
				],
			},
		],
	},
];

export const useBreadcrumbleStore = create<{
	breadcrumble: BreadcrumbleChildren;
	path: string;
	visible: boolean;
	vars: Record<string, string>;
	getBreadcrumble: () => { name: string; path: string }[];
}>((_set, get) => ({
	breadcrumble: defaultValue,
	vars: {},
	visible: false,
	path: '/',
	getBreadcrumble() {
		const currentPath = get().path;
		const vars = get().vars;
		const visible = get().visible;
		if (!visible) return [];
		return deepWideSearchBreadcrumble(currentPath, vars);
	},
}));

export const useBreadcrumble = (
	path: string,
	vars?: Record<string, string>
) => {
	useEffect(() => {
		useBreadcrumbleStore.setState(store => {
			store.path = path;
			store.visible = true;
			store.vars = vars ? vars : store.vars;
			return Object.assign({}, store);
		});
		return () => {
			useBreadcrumbleStore.setState(store => {
				store.visible = false;
				return Object.assign({}, store);
			});
		};
	}, []);
};

const deepWideSearchBreadcrumble = (
	path: string,
	vars: Record<string, string>
) => {
	const breadcrumbles = useBreadcrumbleStore.getState().breadcrumble;
	let currentNode: any | null = breadcrumbles[0];
	const history: { name: string; path: string }[] = [
		{ name: 'Главная', path: '/' },
	];

	while (currentNode) {
		const currentEl = currentNode.children.find((n: any) =>
			path.includes(n.path)
		);
		if (!currentEl) {
			break;
		}
		currentNode = currentEl;
		let value = currentNode.value;
		if (currentNode.vars && currentNode.vars.length > 0) {
			const existVar = currentNode.vars.find(
				(v: string) => currentNode.path.split('/').at(-1) == `[${v}]`
			);
			if (existVar && existVar in vars) {
				history.push({ name: vars[existVar], path: currentNode.path });
			}
		} else {
			history.push({ name: value, path: currentNode.path });
		}
	}

	return history;
};
