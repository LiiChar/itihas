import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

type Node = {
	id: number;
	name: string;
	image?: string;
	content: string;
	style?: React.HTMLAttributes<HTMLDivElement>['style'];
	relation: { nodeId: number; type: string }[];
	position: { x: number; y: number };
};

const Nodes: Node[] = [
	{
		id: 1,
		content: 'Старт',
		name: 'fds',
		position: { x: 300, y: 450 },
		style: {},
		relation: [{ nodeId: 2, type: 'line' }],
	},
	{
		id: 2,
		content: 'Конец',
		name: 'fds',
		position: { x: 400, y: 450 },
		relation: [],
	},
];

type Point = {
	x: number;
	y: number;
};

function distance(start: Point, end: Point) {
	const dx = start.x - end.x;
	const dy = start.y - end.y;

	return Math.sqrt(dx * dx + dy * dy);
}

function calculatePath(start: Point, end: Point) {
	const center = {
		x: (start.x + end.x) / 2,
		y: (start.y + end.y) / 2,
	};

	const controlPoint = {
		x:
			start.x +
			Math.min(distance(start, end), Math.abs(end.y - start.y) / 2, 150),
		y: start.y,
	};

	return `
      M ${start.x},${start.y} 
      Q ${controlPoint.x}, ${controlPoint.y} ${center.x},${center.y} 
      T ${end.x},${end.y}
    `;
}

const getValueFromCss = (string: any): number => {
	const regex = /(px|wh|vh|em|rem|%)/g;
	string = string.replace(regex, '');
	return parseInt(string);
};

export const Board = () => {
	const [nodes, setNodes] = useState(Nodes);
	const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
	const [isDragging, setIsDragging] = useState(false);
	const layerRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		return;
		if (active) {
			return;
		}

		if (!isDragging) {
			return;
		}

		if (e.buttons !== 1) {
			setIsDragging(false);

			return;
		}

		setViewport(prev => ({
			...prev,
			x: prev.x + e.movementX,
			y: prev.y + e.movementY,
		}));
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
			className='overflow-hidden w-full h-screen '
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			ref={layerRef}
		>
			<div
				className='relative w-full h-full'
				style={{
					transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
				}}
			>
				<svg className='pointer-events-none overflow-visible fill-transparent stroke-white absolute w-full h-full origin-center'>
					{nodes.map(n =>
						n.relation.map(r => {
							const x1 = n.position.x;
							const y1 = n.position.y;

							const x2 =
								nodes[nodes.findIndex(n => n.id == r.nodeId)].position.x;

							const y2 =
								nodes[nodes.findIndex(n => n.id == r.nodeId)].position.y;

							// console.log(Math.atan(y1 / x1), y1, x1);
							// console.log(Math.atan(y2 / x2), y2, x2);
							// console.log(Math.abs(Math.atan(y1 / x1) - Math.atan(y2 / x2)));

							const d = calculatePath(
								{
									x: x1,
									y: y1,
								},
								{
									x: x2,
									y: y2,
								}
							);

							return <path d={d} key={n.id + '-' + r.nodeId} stroke='white' />;
						})
					)}
				</svg>
				{nodes.map((n, i) => (
					<div
						onMouseDown={() => {
							setActive(true);
						}}
						onMouseLeave={() => {
							setActive(false);
						}}
						onMouseMove={(e: any) => {
							if (!active) {
								return;
							}
							var bounds = layerRef.current!.getBoundingClientRect();
							// console.log({ x: e.clientX, y: e.clientY }, bounds, n.position);

							var x = e.clientX - layerRef.current!.offsetLeft;
							var y = e.clientY - layerRef.current!.offsetTop;
							console.log('x', x);
							console.log('y', y);

							setNodes(prev => {
								prev[i].position = {
									x: x,
									y: y,
								};
								return [...prev];
							});
						}}
						onMouseUp={() => {
							setActive(false);
						}}
						key={n.id}
						style={{ top: n.position.x + 'px', left: n.position.y + 'px' }}
						className='absolute bg-secondary text-secondary-foreground rounded-md px-4 py-3'
					>
						{n.content}
						<div>
							<div>перетащить</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
