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

type BreadcrumbleStoreVariables = {
	breadcrumble: BreadcrumbleChildren;
	breadcrumblePath: { name: string; path: string }[];
	path: string;
	visible: boolean;
	vars: Record<string, string>;
};

export type BreadcrumbleStoreType = BreadcrumbleStoreVariables & {
	setStore: (data: Partial<BreadcrumbleStoreVariables>) => void;
	getBreadcrumble: (
		path?: string,
		variables?: Record<string, string>,
		isVisible?: boolean
	) => { name: string; path: string }[];
};

export const useBreadcrumbleStore = create<BreadcrumbleStoreType>(
	(set, get) => ({
		breadcrumble: defaultValue,
		vars: {},
		breadcrumblePath: [{ name: 'Главная', path: '/' }],
		visible: false,
		path: '/',
		setStore(data) {
			set(state => ({
				...data,
				breadcrumblePath: state.getBreadcrumble(
					data.path,
					data.vars,
					data.visible
				),
			}));
		},

		getBreadcrumble(
			path?: string,
			variables?: Record<string, string>,
			isVisible?: boolean
		) {
			const currentPath = path ?? get().path;
			const vars = variables ?? get().vars;
			const visible = isVisible ?? get().visible;
			if (!visible) return [];

			return deepWideSearchBreadcrumble(currentPath, vars);
		},
	})
);

export const useBreadcrumble = (
	path: string,
	vars?: Record<string, string>
) => {
	const { setStore } = useBreadcrumbleStore();
	useEffect(() => {
		setStore({ path, vars, visible: true });
		return () => {
			setStore({ path, vars, visible: false });
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
