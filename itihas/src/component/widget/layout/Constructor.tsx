import React, { useState } from 'react';
import {
	DndContext,
	useDraggable,
	useDroppable,
	DragEndEvent,
	DragOverlay,
	DragOverEvent,
} from '@dnd-kit/core';
import { rectSwappingStrategy } from '@dnd-kit/sortable';
import { LayoutComponent } from '@/shared/type/layout';
import {
	addUniqueId,
	findObjectById,
	findObjectByIdWithPath,
	removeObjectById,
	swapElementsByPaths,
	UniqueType,
	updateObjectByPath,
} from '@/shared/lib/object';
import { handleImageError } from '@/shared/lib/image';
import { Button } from '@/shared/ui/button';
import { create } from 'zustand';
import { useMount } from '@siberiacancode/reactuse';
import { useBlockResize } from '@/shared/hooks/useResize';
import { PlusCircle } from 'lucide-react';
import { insertBetween } from '@/shared/lib/array';
import { boolean } from 'zod';

type DroppableLayoutTemplate = { template: DroppableLayout };
type DroppableLayoutsTemplate = { templates: DroppableLayouts };
type DroppableLayouts = UniqueType<LayoutComponent[]>;
type DroppableLayout = UniqueType<LayoutComponent>;

type DireactionAdded = 'top' | 'right' | 'bottom' | 'left';

type MethodsBuildStore = {
	addTemplate: (
		targetId: string,
		direction: DireactionAdded,
		template?: DroppableLayout,
		inner?: boolean
	) => string;
	setTemplate: (template: DroppableLayouts) => void;
};

const useLayoutBuildStore = create<
	DroppableLayoutsTemplate & MethodsBuildStore
>(set => ({
	templates: [] as DroppableLayouts,
	setTemplate(templates) {
		set(prev => ({ templates }));
	},
	addTemplate(targetId, direction, template, inner) {
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

			const { item: targetTemplate, path } = targetTemplateResult;
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

			if (template) {
				store.templates = removeObjectById(store.templates, template.id);
			}
			store.templates = updateObjectByPath(
				store.templates,
				parentTemplatePath as string[],
				parent
			);

			return Object.assign({}, store);
		});

		return newTempalte.id;
	},
}));

const updateLayoutBuildStore = (templates: DroppableLayouts) => {
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

type DroppableProps = {
	children?: React.ReactNode;
} & DroppableLayoutTemplate;

const DraggableBlock = ({ template, children }: DroppableProps) => {
	const { attributes, listeners, setNodeRef, isDragging, transform, node } =
		useDraggable({
			id: 'drag' + template.id,
			data: {
				template,
			},
		});
	const addTemplate = useLayoutBuildStore(store => store.addTemplate);
	useBlockResize<HTMLDivElement>(node as any, {
		resizable: true,
	});

	return (
		<div
			ref={el => {
				setNodeRef(el);
			}}
			{...listeners}
			{...attributes}
			className={`w-full h-full relative after:w-full after:h-full after:absolute after:top-0 after:left-0 after:border-2 after:border-dashed after:border-white after:cursor-move  rounded shadow-md ${
				isDragging ? 'opacity-50' : 'opacity-100'
			}`}
		>
			{template.children ? (
				<DroppableArea template={template} />
			) : (
				getComponent(template)
			)}
			<div
				onMouseUp={e => addTemplate(template.id, 'left')}
				className='h-4 w-4 z-30 absolute top-[calc(50%-7px)] -left-3	'
			>
				<PlusCircle className='w-full h-full' />
			</div>
			<div
				onMouseUp={() => addTemplate(template.id, 'top')}
				className='h-4 w-4 z-30 absolute -top-3 left-[calc(50%-7px)]'
			>
				<PlusCircle className='w-full h-full' />
			</div>
			<div
				onMouseUp={() => addTemplate(template.id, 'right')}
				className='h-4 w-4 z-30 absolute bottom-[calc(50%-7px)] -right-3'
			>
				<PlusCircle className='w-full h-full' />
			</div>
			<div
				onMouseUp={() => addTemplate(template.id, 'bottom')}
				className='h-4 w-4 z-30 absolute -bottom-3 right-[calc(50%-7px)]'
			>
				<PlusCircle className='w-full h-full' />
			</div>
		</div>
	);
};

// Компонент дроппируемой области
const DroppableArea = ({ template, children }: DroppableProps) => {
	const { setNodeRef } = useDroppable({
		id: 'area' + template.id,
		data: { template },
	});

	return (
		<div ref={setNodeRef} className='flex flex-wrap  min-w-24 min-h-16'>
			{template.children ? (
				Array.isArray(template.children) ? (
					template.children.map(t => (
						<DraggableBlock
							key={'id' in t ? (t.id as any) : ''}
							template={t as DroppableLayout}
						/>
					))
				) : (
					<DraggableBlock template={template.children as DroppableLayout} />
				)
			) : (
				<DraggableBlock template={template} />
			)}
		</div>
	);
};

// Основной компонент шаблона
export const TemplateBuilder = ({
	templatesProps,
}: {
	templatesProps: LayoutComponent[];
}) => {
	const { templates, setTemplate, addTemplate } = useLayoutBuildStore();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [innerInsert, setInnerInsert] = useState<boolean>(false);
	const [overInnerInsert, setOverInnerInsert] = useState<boolean>(false);

	useMount(() => {
		useLayoutBuildStore.setState(prev => ({
			templates: addUniqueId(templatesProps),
		}));
	});

	const handleDragStart = (event: DragEndEvent) => {
		setActiveId(`${event.active.id}`);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (innerInsert) {
			if (active.data.current && overId) {
				addTemplate(
					`_${(overId as string).split('_')[1]}`,
					'left',
					active.data.current.template,
					true
				);
			}
		} else {
			if (!over) return;
			if (over.id == active.id) return;
			const prevElement = findObjectByIdWithPath(
				templates,
				`_${(active.id as string).split('_')[1]}`
			);
			const newElement = findObjectByIdWithPath(
				templates,
				`_${(over.id as string).split('_')[1]}`
			);
			if (!prevElement || !newElement) return;
			if (prevElement.path !== newElement.path) {
				const newTempates = swapElementsByPaths(
					prevElement.path as string[],
					newElement.path as string[],
					templates
				);
				setTemplate(newTempates);
			}
		}
		setOverInnerInsert(false);
		setInnerInsert(false);
	};

	const handleDragOver = (event: DragOverEvent) => {
		setOverId(`${event.over?.id!}`);
		if (overInnerInsert) return;
		setOverInnerInsert(true);
		setTimeout(() => {
			setOverInnerInsert(false);
			setInnerInsert(true);
		}, 2000);
	};

	return (
		<DndContext
			onDragOver={handleDragOver}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className='content-height space-y-4 flex justify-center items-center flex-col'>
				{templates.map(b => (
					<DroppableArea template={b} />
				))}
			</div>
			<DragOverlay dropAnimation={null}>
				{activeId
					? getComponent(
							findObjectById(templates, `_${activeId.split('_')[1]}`)!
					  )
					: null}
			</DragOverlay>
		</DndContext>
	);
};

export const getComponent = (component: LayoutComponent) => {
	if (!component) return '';
	const Component = LayoutComponents[component.type];
	if (!Component) return '';
	return <Component c={component} />;
};

export const ContentLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='text-pretty w-full h-full flex justify-center items-center aspect-[16/4]  bg-background'>
			Содержание
		</div>
	);
};

export const PointLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='flex aspect-[16/5] flex-col gap-2 justify-start items-start w-full h-full'>
			<div className='w-full h-1/3  bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3  bg-background'>
				Пункты выбора
			</div>
			<div className='w-full h-1/3  bg-background'></div>
		</div>
	);
};

export const ImageLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='relative aspect-[12/9] w-full  bg-background  flex justify-center items-center  h-full'>
			<img
				className='absolute top-0 left-0 h-full aspect-[12/9] object-cover w-full rounded-tl-lg rounded-tr-lg'
				src={''}
				alt=''
				onError={handleImageError}
			/>
			Изображение
		</div>
	);
};

export const CustomLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const ActionLayout = ({}: { c: LayoutComponent }) => {
	return <Button className=' w-full h-full'>Действие</Button>;
};

export const ListLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className=' w-full h-full flex aspect-[16/5] flex-col gap-2 justify-start items-start'>
			<div className='w-full h-1/3  bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3  bg-background'>
				Список
			</div>
			<div className='w-full h-1/3  bg-background'></div>
		</div>
	);
};

export const BlockLayout = ({}: { c: LayoutComponent }) => {
	return;
	<div>block</div>;
};

export const VideoLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const TextLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

const LayoutComponents: Record<string, any> = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	action: ActionLayout,
	list: ListLayout,
	block: BlockLayout,
	video: VideoLayout,
	text: TextLayout,
};
