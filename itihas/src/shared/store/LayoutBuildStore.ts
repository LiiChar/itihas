import { LayoutComponent } from '@/shared/type/layout';
import {
	addUniqueId,
	findObjectById,
	findObjectByIdWithPath,
	UniqueType,
	updateObjectByPath,
} from '@/shared/lib/object';
import { create } from 'zustand';
import { insertBetween } from '@/shared/lib/array';

export type DroppableLayoutTemplate = { template: DroppableLayout };
export type DroppableLayoutsTemplate = { templates: DroppableLayouts };
export type DroppableLayouts = UniqueType<LayoutComponent[]>;
export type DroppableLayout = UniqueType<LayoutComponent>;

export type DireactionAdded = 'top' | 'right' | 'bottom' | 'left';

export type MethodsBuildStore = {
	addTemplate: (
		targetId: string,
		direction?: DireactionAdded,
		template?: DroppableLayout,
		inner?: boolean
	) => string;
	setTemplate: (template: DroppableLayouts) => void;
	setIsResizing: (resize: boolean) => void;
	setIsMoving: (move: boolean) => void;
	setSelectedLayout: (layout: DroppableLayout | null) => void;
	removeTemplate: (id: string) => void;
	updateTemplate: (id: string, template: Partial<DroppableLayout>) => void;
};

export type PropertyBuildStore = DroppableLayoutsTemplate & {
	isResizing: boolean;
	selectedLayout: DroppableLayout | null;
	isMoving: boolean;
};

export const useLayoutBuildStore = create<
	PropertyBuildStore & MethodsBuildStore
>(set => ({
	templates: [] as DroppableLayouts,
	isResizing: false,
	selectedLayout: null,
	isMoving: false,
	removeTemplate(id) {
		set(store => {
			const findedTempate = findObjectByIdWithPath(store.templates, id);
			if (!findedTempate) return store;
			const { path } = findedTempate;
			const parentTemplatePath = path.slice(0, -1);
			let parentTemplate = store.templates as any;
			parentTemplatePath.forEach(p => {
				parentTemplate = parentTemplate[p as any];
			});

			const targetIndexTemplate = path.at(-1);

			if (!targetIndexTemplate) return store;

			delete parentTemplate[targetIndexTemplate];

			const newTemplates = updateObjectByPath(
				store.templates,
				parentTemplatePath as string[],
				parentTemplate
			);
			return {
				templates: newTemplates,
			};
		});
	},
	updateTemplate(id, template) {
		set(store => {
			const findedTempate = findObjectByIdWithPath(store.templates, id);
			if (!findedTempate) return store;
			const { item, path } = findedTempate;
			const newTemplates = updateObjectByPath(
				store.templates,
				path as string[],
				Object.assign(item, template)
			);
			return { templates: newTemplates };
		});
	},
	setSelectedLayout(layout) {
		set(() => ({ selectedLayout: layout }));
	},
	setIsMoving(move) {
		set(() => ({ isMoving: move }));
	},
	setIsResizing(resize) {
		set(() => ({ isResizing: resize }));
	},
	setTemplate(templates) {
		set(() => ({ templates }));
	},
	addTemplate(targetId, direction = 'left', template, inner) {
		const newTempalte = Object.assign(
			addUniqueId({
				content: '',
				type: 'block',
			} as LayoutComponent),
			template
		);
		set(store => {
			const targetTemplateResult = findObjectByIdWithPath(
				store.templates,
				targetId
			);
			if (!targetTemplateResult) return store;

			const { path } = targetTemplateResult;
			const parentTemplatePath = inner ? path : path.slice(0, -1);
			let parentTemplate = store.templates as any;
			parentTemplatePath.forEach(p => {
				parentTemplate = parentTemplate[p as any];
			});

			if (!parentTemplate) {
				return Object.assign({}, store);
			}
			let parent = parentTemplate as any;

			let insertIndex = 0;

			if (direction == 'left') {
				insertIndex = 0;
			} else if (direction == 'right') {
				insertIndex = 1;
			} else if (direction == 'top') {
				insertIndex = 0;
			} else if (direction == 'bottom') {
				insertIndex = 1;
			}

			const targetIndexTemplate = path.at(-1);

			if (targetIndexTemplate != undefined) {
				if (!Array.isArray(parent)) {
					if (parent.children) {
						parent.children = insertBetween(
							parent.children,
							newTempalte,
							Math.max(+targetIndexTemplate + insertIndex, 0)
						);
					} else {
						if (parent.type == 'block' && !inner) {
							parent.children = [newTempalte];
						} else {
							const wrapperBlockTemplate = addUniqueId({
								content: '',
								type: 'block',
								children: [parent],
							} as LayoutComponent);
							parent = wrapperBlockTemplate;
							parent.children = insertBetween(
								parent.children,
								newTempalte,
								Math.max(+targetIndexTemplate + insertIndex, 0)
							);
						}
					}
				} else {
					parent = insertBetween(
						parent,
						newTempalte,
						Math.max(+targetIndexTemplate + insertIndex, 0)
					);
				}
			} else {
				if (parent.children) {
					parent.children.push(newTempalte);
				} else {
					if (!Array.isArray(parent)) {
						parent.children = [newTempalte];
					} else {
						parent = [newTempalte];
					}
				}
			}

			// if (template) {
			// 	store.templates = removeObjectById(store.templates, template.id);
			// }
			const newTemplates = updateObjectByPath(
				store.templates,
				parentTemplatePath as string[],
				parent
			);
			return {
				templates: newTemplates,
			};
		});

		return newTempalte.id;
	},
}));

export const updateLayoutBuildStore = (templates: DroppableLayouts) => {
	useLayoutBuildStore.setState(state => {
		templates.forEach(t => {
			const findedTemplate = findObjectById(state.templates, t.id);
			if (!findedTemplate) return;
			Object.entries(t).forEach(([k, v]) => {
				(findedTemplate as any)[k] = v;
			});
		});
		return Object.assign({}, state);
	});
};
