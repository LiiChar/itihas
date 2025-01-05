import { Token } from './Parser';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { ComponentProps, ReactNode } from 'react';
import { useLayout } from '@/shared/hooks/useLayout';

type Node = {
	token: Token;
	nodes?: Node[];
	x: number;
	y: number;
	height: number;
	width: number;
};

const PrimaryNode = ({
	node,
	propsRect,
	propsText,
}: {
	node: Node;
	propsRect?: ComponentProps<typeof Rect>;
	propsText?: ComponentProps<typeof Text>;
}) => {
	return (
		<Rect width={node.width} height={node.height} {...propsRect}>
			<Text {...propsText} text={node.token.value} />
		</Rect>
	);
};

const MoveNode = ({
	node,
	propsText,
	propsRect,
}: {
	node: Node;
	propsText?: ComponentProps<typeof Text>;
	propsRect?: ComponentProps<typeof Rect>;
}) => {
	return (
		<>
			<Rect
				x={node.x}
				y={node.y}
				{...propsRect}
				height={node.height}
				width={node.width}
			/>
			<Text
				x={node.x}
				y={node.y + node.height / 2 - 2}
				text={'Переместиться - ' + node.token.value}
				{...propsText}
			/>
		</>
	);
};

const ConditionNode = ({}: { node: Node }) => {
	return <Rect></Rect>;
};

const OperatorNode = ({}: { node: Node }) => {
	return <Rect></Rect>;
};

const getNodesFromToken = (tokens: Token[]): Node[] => {
	// const DefaultNode: Record<
	// 	Node['token']['type'],
	// 	Record<Partial<keyof Node>, any>
	// > = {
	// 	boolean: {
	// 		height: 40,
	// 		width: 200,
	// 	},
	// };

	const nodes: Node[] = [];
	for (let i = 0; i < tokens.length; i++) {
		const el = tokens[i];
		const notExistChildren = !isPrimaryToken(el);
		const height = nodes.reduce((acc, a) => acc + a.height, 0);
		nodes.push({
			token: el,
			nodes: notExistChildren ? undefined : getNodesFromToken(el.value),
			height: 50,
			width: 50,
			x: 0,
			y: height + 50,
		});
	}
	return nodes;
};

const isPrimaryToken = (token: Token) => {
	return (
		token.type == 'boolean' || token.type == 'string' || token.type == 'integer'
	);
};

const isOperatorToken = (token: Token) => {
	return (
		token.type == 'sum' ||
		token.type == 'dif' ||
		token.type == 'div' ||
		token.type == 'mul'
	);
};

const CodeComponent = ({ nodes }: { nodes: Node[] }) => {
	return (
		<>
			{nodes.map(n => {
				let Component: ReactNode;

				if (isPrimaryToken(n.token)) {
					Component = <PrimaryNode node={n} propsRect={{ fill: '#fff' }} />;
				}
				if (isOperatorToken(n.token)) {
					Component = <OperatorNode node={n} />;
				}
				if (n.token.type == 'move') {
					Component = (
						<MoveNode
							node={n}
							propsText={{ fill: '#ff0000', draggable: true, offsetY: 5 }}
							propsRect={{ fill: '#fff', offsetY: 2, draggable: true }}
						/>
					);
				}
				if (n.token.type == 'if') {
					Component = <ConditionNode node={n} />;
				}
				return Component!;
			})}
		</>
	);
};

export const Editor = () => {
	useLayout({ footer: true });
	const nodes = getNodesFromToken([
		{
			index: 1,
			type: 'move',
			value: 1,
		},
	]);

	return (
		<div>
			<div>Написать код</div>
			<div className='flex justify-center items-center '>
				<Stage className='border-2 border-foreground' width={800} height={800}>
					<Layer>
						<CodeComponent nodes={nodes} />
					</Layer>
				</Stage>
			</div>
		</div>
	);
};
