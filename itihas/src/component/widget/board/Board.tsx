import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { HistoryPage, HistoryPages } from '@/shared/type/history';

import { useEvent, useInterval } from '@siberiacancode/reactuse';
import { BoxSelect, Edit, PlusSquare, Trash2 } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { EditPageModal } from './Board/EditPageModal';
import { Separator } from '@/shared/ui/separator';
import { CreatePageModal } from './Board/CreatePageModal';
import { Actions } from './Board/Actions';
import { deleteActionPage, updateActionPage } from '@/shared/api/page';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { UpdatePointPageModal } from './Board/UpdatePointPageModal';
import { CreatePointPageModal } from './Board/CreatePointPageModal';
import { toast } from 'sonner';
import { ReadLayoutModal } from '../page/ReadLayoutModal';

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

function calculatePath(start: Point, end: Point, i: number, _nodes: Node[]) {
	const dx = end.x - start.x;

	const side = dx > 0 ? 1 : -1;
	const HEIGHT_POINT = 13;
	const HEIGHT_CONTENT_NODE = NODE_HEIGHT * 0.13;

	// Коррекция начала и конца линии
	const startOffset = {
		x: start.x + ((NODE_WIDTH - 10) / 2) * side,
		y: start.y + HEIGHT_CONTENT_NODE + HEIGHT_POINT * i,
	};

	const endOffset = {
		x: end.x + ((NODE_WIDTH - 10) / 2) * -side,
		y: end.y - 1 + HEIGHT_CONTENT_NODE + HEIGHT_POINT * i,
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
	const storagePos = localStorage.getItem('nodes_positions');
	if (storagePos) {
		let nodePos = JSON.parse(storagePos);
		return nodes.map((n, i) => {
			if (n.id in nodePos) {
				n.position = nodePos[n.id];
			} else {
				n.position = {
					x: NODE_WIDTH * i * 1.1,
					y: (NODE_HEIGHT / 4) * n.relation.length,
				};
			}
			return n;
		});
	}
	return nodes.map((n, i) => {
		n.position = {
			x: NODE_WIDTH * i * 1.1,
			y: (NODE_HEIGHT / 4) * n.relation.length,
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

export const Board = ({ history }: { history: HistoryPages }) => {
	const [nodes, setNodes] = useState(() =>
		calculateNodePositions(generateNodesByHistories(history.pages))
	);

	useEffect(() => {
		setNodes(calculateNodePositions(generateNodesByHistories(history.pages)));
	}, [history]);

	const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.7 });
	const [isDragging, setIsDragging] = useState(false);
	const layerRef = useRef<HTMLDivElement>(null);
	const [activeNode, setActiveNode] = useState<number | null>(null);
	const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

	useInterval(() => {
		const nodePos = nodes.reduce<Record<string, any>>((acc, n) => {
			acc[n.id] = n.position;
			return acc;
		}, {});
		localStorage.setItem('nodes_positions', JSON.stringify(nodePos));
	}, 5000);

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
			{/* TODO <DotsBackground /> */}
			<Actions
				actions={[
					{
						action: () => {},
						element: (
							<CreatePageModal
								onCreate={page => {
									if (typeof page == 'string') {
										toast(page);
										return;
									}
									setNodes(prev => [
										...prev,
										...generateNodesByHistories([page]),
									]);
								}}
							>
								<PlusSquare className='w-min h-min' />
							</CreatePageModal>
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
				<svg className='pointer-events-none overflow-visible fill-transparent stroke-white absolute w-full h-full origin-center z-40 -mt-0]'>
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
				<BoardNodes handleMouseDown={handleMouseDown} nodes={nodes} />
			</div>
		</div>
	);
};

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
		const { runListener } = useListenerStore();
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
						className='absolute h-full select-none bg-secondary z-30 text-secondary-foreground rounded-md flex flex-col'
					>
						<div className='absolute top-1 right-1 aspect-square w-[25px] h-[25px] text-center bg-black/60 p-1'>
							{n.page.id}
						</div>
						<div className='absolute top-1 left-1 stroke-primary aspect-square w-[15px] h-[15px] text-center p-1'>
							<ReadLayoutModal
								historyId={n.page.historyId}
								pageId={n.page.id}
							/>
						</div>
						<div className='h-[63%]'>
							<BoardNode node={n} />
						</div>
						<Separator
							orientation='horizontal'
							className='h-[1px] mt-1 w-full bg-background'
						/>
						<div className='flex-grow overflow-auto'>
							{n.page.points.map(p => (
								<div
									className='px-1 h-4 gap-1 flex justify-center items-center'
									key={p.id}
								>
									<div className='w-1  h-1 rounded-[50%] bg-foreground aspect-square'></div>
									<div className=' w-full relative	line-clamp-1 flex justify-between bg-secondary text-xs'>
										<div className='max-w-[140px] line-clamp-1'>{p.name}</div>
										<div className='flex top-[2px] right-0 absolute items-center h-min'>
											<UpdatePointPageModal
												action={p}
												pagesName={nodes.map(n => ({
													id: n['page']['id'],
													name: n.page.name,
												}))}
												onCreate={async action => {
													const res = await updateActionPage(p.id, action);
													if (res.status == 200) {
														runListener('EditHistory');
													}
												}}
											/>
											<Trash2
												onClick={async () => {
													const res = await deleteActionPage(p.id);
													if (res.status == 200) {
														runListener('EditHistory');
													}
												}}
												className='cursor-pointer'
												height={11}
											/>
										</div>
									</div>
									<div className='w-1 h-1 rounded-[50%] bg-foreground aspect-square'></div>
								</div>
							))}
						</div>
						<div className='flex h-7 py-3 justify-around items-center'>
							<CreatePointPageModal
								pageId={n.id}
								historyId={n.page.historyId}
							/>
							<BoxSelect
								width={20}
								className='cursor-pointer'
								onMouseDown={e => handleMouseDown(e, i)}
							/>
							<EditPageModal page={n.page}>
								<Edit width={16} className='cursor-pointer' />
							</EditPageModal>
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
			<img
				className='select-none object-cover max-h-36 aspect-auto w-full'
				src={getFullUrl(node.page.image)}
				onError={handleImageError}
			/>
			<div className='text-base px-1 min-h-[16.8px] line-clamp-1'>
				{node.page.name}
			</div>
			<div className='text-xs px-1 line-clamp-3'>{node.page.content}</div>
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
					const relationNodes = n.relation.reduce<Node[]>((acc, r) => {
						const findedNodes = nodes.find(n => n.id === r.nodeId);
						if (findedNodes) {
							acc.push(findedNodes);
						}
						return acc;
					}, []);
					const { path, startOffset } = calculatePath(
						startNode.position,
						endNode.position,
						j + 1,
						relationNodes
					);

					// Отрисовка белого круга в начале линии
					const circleX = startOffset.x;
					const circleY = startOffset.y;

					return (
						<g key={crypto.randomUUID()}>
							{/* Белый круг на начале соединения */}
							<circle cx={circleX} cy={circleY} r='2' fill='white' />
							{/* Линия со стрелкой на конце */}
							<path
								d={path}
								stroke='white'
								className='hover:stroke-primary'
								markerEnd='url(#arrow)'
							/>
						</g>
					);
				})
			)}
		</>
	);
});
