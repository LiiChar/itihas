import { getFullUrl } from '@/shared/lib/image';
import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { HistoryPage, HistoryPages } from '@/shared/type/history';

import { useEvent, useMount } from '@siberiacancode/reactuse';
import { BoxSelect } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { EditPageModal } from './Board/EditPageModal';
import { Separator } from '@/shared/ui/separator';
import { CreatePageModal } from './Board/CreatePageModal';
import { randomFloat } from '@/shared/lib/number';
import { Actions } from './Board/Actions';
import { CreatePointPageModal } from './Board/CreatePointPageModal';

type Node = {
	id: number;
	page: HistoryPage;
	style?: React.HTMLAttributes<HTMLDivElement>['style'];
	relation: { nodeId: number; type: 'solid' | 'many' }[];
	position: { x: number; y: number };
};

type Point = {
	x: number;
	y: number;
};

const NODE_WIDTH = 200; // ширина ноды
const NODE_HEIGHT = 300; // высота ноды

function calculatePath(start: Point, end: Point, i: number) {
	const dx = end.x - start.x;

	// Определение стороны относительно начальной точки
	const side = dx > 0 ? 1 : -1; // Если конечная точка справа, side = 1, иначе -1
	const HEIGHT_CONTENT_NODE = 57;
	const HEIGHT_POINT = 17;

	// Коррекция начала и конца линии
	const startOffset = {
		x: start.x + ((NODE_WIDTH - 10) / 2) * side,
		y: start.y + HEIGHT_CONTENT_NODE + HEIGHT_POINT * i,
	};

	const endOffset = {
		x: end.x + ((NODE_WIDTH - 10) / 2) * -side,
		y: end.y + HEIGHT_CONTENT_NODE + HEIGHT_POINT * i,
	};

	const controlPoint1 = {
		x: startOffset.x + (endOffset.x - startOffset.x) / 1.5,
		y: startOffset.y, // Контроль высоты изгиба
	};

	const controlPoint2 = {
		x: endOffset.x - (endOffset.x - startOffset.x) / 1.5,
		y: endOffset.y,
	};

	return {
		path: `
      M ${startOffset.x},${startOffset.y}
      C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${endOffset.x},${endOffset.y}
    `,
		startOffset,
		endOffset,
	};
}

function getRelation(point: string) {
	// Используем регулярное выражение для поиска move(<значение>)
	const match = point.match(/move\(([^)]+)\)/);

	if (match) {
		const value = match[1]; // Извлекаем значение внутри скобок
		// Проверяем, является ли значение числом
		if (!isNaN(+value) && !isNaN(parseFloat(value))) {
			return Number(value); // Возвращаем числовое значение
		} else {
			return false; // Возвращаем false, если это не число
		}
	}

	return false; // Если не найдено move(), возвращаем false
}

const calculateNodePositions = (nodes: Node[]): Node[] => {
	return nodes.map((n, i) => {
		n.position = {
			x: NODE_WIDTH * i * 1.1,
			y: (NODE_HEIGHT / 4) * n.relation.length * randomFloat(0.7, 1.3),
		};
		return n;
	});
};

const generateNodesByHistories = (pages: HistoryPage[]) => {
	const nodes: Node[] = [];
	const pos = { x: 0, y: 0 };
	pages.forEach(h => {
		const relations: Node['relation'] = [];
		h.points.forEach(p => {
			const relation = getRelation(p.action);
			const type: Node['relation'][number]['type'] = 'solid';
			if (relation != false) {
				relations.push({
					nodeId: relation,
					type,
				});
			}
		});

		nodes.push({
			page: h,
			id: h.id,
			position: pos,
			relation: relations,
		});
	});
	return nodes;
};

export const Board = memo(({ history }: { history: HistoryPages }) => {
	const [nodes, setNodes] = useState(() =>
		calculateNodePositions(generateNodesByHistories(history.pages))
	);

	const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.7 });
	const [isDragging, setIsDragging] = useState(false);
	const layerRef = useRef<HTMLDivElement>(null);
	const [activeNode, setActiveNode] = useState<number | null>(null);
	const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
	useMount(() => {
		setVisibleFooter(false);
		setVisibleHeader(false);
	});

	const handleMouseDown = useEvent(
		(e: React.MouseEvent, nodeIndex: number, isViewport: boolean = false) => {
			if (isViewport) {
				setIsDragging(true);
				return;
			}
			const node = nodes[nodeIndex];
			const mouseX = (e.clientX - layerRef.current!.offsetLeft) / viewport.zoom;
			const mouseY = (e.clientY - layerRef.current!.offsetTop) / viewport.zoom;

			setOffset({
				x: mouseX - node.position.x,
				y: mouseY - node.position.y,
			});

			setActiveNode(nodeIndex);
			setIsDragging(true);
		}
	);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!activeNode && isDragging) {
			setViewport(prev => ({
				...prev,
				x: prev.x + e.movementX,
				y: prev.y + e.movementY,
			}));
			return;
		}
		if (!isDragging || activeNode === null) return;

		const mouseX = (e.clientX - layerRef.current!.offsetLeft) / viewport.zoom;
		const mouseY = (e.clientY - layerRef.current!.offsetTop) / viewport.zoom;

		setNodes(prevNodes => {
			const updatedNodes = [...prevNodes];
			updatedNodes[activeNode].position = {
				x: mouseX - offset.x,
				y: mouseY - offset.y,
			};
			return updatedNodes;
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setActiveNode(null);
	};

	useEffect(() => {
		if (!layerRef.current) {
			return;
		}

		layerRef.current.onwheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.ctrlKey) {
				const speedFactor =
					(e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * 10;

				setViewport(prev => {
					const pinchDelta = -e.deltaY * speedFactor;

					return {
						...prev,
						zoom: Math.min(
							1.5,
							Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta))
						),
					};
				});
			}
		};
	}, [setViewport]);

	return (
		<div
			className='overflow-hidden relative w-full h-screen'
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseDown={e => handleMouseDown(e, 0, true)}
			ref={layerRef}
		>
			<Actions
				actions={[
					{
						action: () => {},
						element: (
							<CreatePageModal
								onCreate={page =>
									setNodes(prev => [
										...prev,
										...generateNodesByHistories([page]),
									])
								}
							/>
						),
						alt: 'Добавить страницу',
					},
				]}
			/>
			<div
				className='relative w-full h-full'
				style={{
					transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
				}}
			>
				<svg className='pointer-events-none overflow-visible fill-transparent stroke-white absolute w-full h-full origin-center z-40'>
					<defs>
						{/* Определяем маркер-стрелку для конца линии */}
						<marker
							id='arrow'
							viewBox='0 0 10 10'
							refX='10'
							refY='5'
							markerWidth='6'
							markerHeight='6'
							orient='auto-start-reverse'
						>
							<path d='M 0 0 L 10 5 L 0 10 z' fill='white' />
						</marker>
					</defs>
					<BoardRelation nodes={nodes} />
				</svg>
				<BoardNodes handleMouseDown={handleMouseDown} nodes={nodes} />A
			</div>
		</div>
	);
});

export const BoardNodes = memo(
	({
		handleMouseDown,
		nodes,
	}: {
		nodes: Node[];
		handleMouseDown: (
			e: React.MouseEvent,
			nodeIndex: number,
			isViewport?: boolean
		) => void;
	}) => {
		return (
			<>
				{nodes.map((n, i) => (
					<div
						key={n.id}
						style={{
							top: n.position.y + 'px',
							left: n.position.x + 'px',
							width: NODE_WIDTH + 'px',
							height: NODE_HEIGHT + 'px',
							transform: `translate(-${NODE_WIDTH / 2}px, -${
								NODE_HEIGHT / 2
							}px)`, // Центрируем ноду
						}}
						className='absolute h-full select-none bg-secondary z-30 text-secondary-foreground rounded-md'
					>
						<BoardNode node={n} />
						<Separator
							orientation='horizontal'
							className='h-[1px] mt-1 w-full bg-background'
						/>
						<div className='h-14 overflow-auto'>
							{n.page.points.map(p => (
								<div
									className='px-1 h-4 gap-1 flex justify-center items-center'
									key={p.id}
								>
									<div className='w-1  h-1 rounded-[50%] bg-foreground aspect-square'></div>
									<div className=' w-full	line-clamp-1  bg-secondary text-xs'>
										{p.name}
									</div>
									<div className='w-1 h-1 rounded-[50%] bg-foreground aspect-square'></div>
								</div>
							))}
						</div>
						<div className='flex h-7 justify-around items-center'>
							<CreatePointPageModal pageId={n.id} />
							<BoxSelect
								width={20}
								className='cursor-pointer'
								onMouseDown={e => handleMouseDown(e, i)}
							/>
							<EditPageModal page={n.page} />
						</div>
					</div>
				))}
			</>
		);
	}
);
export const BoardNode = memo(({ node }: { node: Node }) => {
	return (
		<div className='overflow-hidden'>
			<div>
				<img
					className='select-none h-[140px] object-fill aspect-video'
					src={getFullUrl(node.page.image)}
				/>
			</div>
			<div className='text-base px-1 min-h-[16.8px] line-clamp-1'>
				{node.page.name}
			</div>
			<div className='text-xs min-h-[33.6px] px-1 line-clamp-3'>
				{node.page.content}
			</div>
		</div>
	);
});

export const BoardRelation = memo(({ nodes }: { nodes: Node[] }) => {
	return (
		<>
			{nodes.map(n =>
				n.relation.map((r, j) => {
					const startNode = n;
					const endNode = nodes.find(n => n.id === r.nodeId);
					if (!endNode) return null;

					const { path, startOffset } = calculatePath(
						startNode.position,
						endNode.position,
						j + 1
					);

					// Отрисовка белого круга в начале линии
					const circleX = startOffset.x;
					const circleY = startOffset.y;

					return (
						<g key={crypto.randomUUID()}>
							{/* Белый круг на начале соединения */}
							<circle cx={circleX} cy={circleY} r='5' fill='white' />
							{/* Линия со стрелкой на конце */}
							<path d={path} stroke='white' markerEnd='url(#arrow)' />
						</g>
					);
				})
			)}
		</>
	);
});
