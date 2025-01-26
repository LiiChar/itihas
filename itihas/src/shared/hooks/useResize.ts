import { useState, useEffect, useCallback, useRef, MouseEvent } from 'react';

interface BlockSize {
	width: number;
	height: number;
}

interface UseBlockResizeOptions {
	initialWidth?: number;
	initialHeight?: number;
	resizable?: boolean; // Добавляем параметр resizable
}

type ResizeDirection =
	| 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| null;

export function useBlockResize<T extends HTMLElement>(
	ref: React.MutableRefObject<T>,
	options?: UseBlockResizeOptions,
	onResize?: (isResize: boolean) => void
): [React.RefObject<T>, BlockSize] {
	let {
		initialWidth = ref.current?.offsetWidth ?? 0,
		initialHeight = ref.current?.offsetHeight ?? 0,
		resizable = false,
	} = options || {};
	const [blockSize, setBlockSize] = useState<BlockSize>({
		width: initialWidth,
		height: initialHeight,
	});
	const blockRef = ref ? ref : useRef(null);
	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
	const initialMousePosition = useRef({ x: 0, y: 0 });
	useEffect(() => {
		initialWidth =
			blockRef.current?.getBoundingClientRect().width ?? initialWidth;
		initialHeight =
			blockRef.current?.getBoundingClientRect().height ?? initialHeight;
		setBlockSize({
			height: initialHeight,
			width: initialWidth,
		});
		if (blockRef.current && blockRef.current.style) {
			blockRef.current.style.width = `${initialWidth}px`;
		}
		if (blockRef.current && blockRef.current.style) {
			blockRef.current.style.height = `${initialHeight}px`;
		}
	}, []);
	const handleMouseDown = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!resizable || !blockRef.current) return;
			e.preventDefault();
			e.stopPropagation();
			setIsResizing(true);
			onResize && onResize(true);
			const rect = blockRef.current.getBoundingClientRect();
			let direction: ResizeDirection = null;

			const threshold = 10;
			if (
				e.clientX > rect.left - threshold &&
				e.clientX < rect.left + threshold
			)
				direction = 'left';
			if (
				e.clientX > rect.right - threshold &&
				e.clientX < rect.right + threshold
			)
				direction = 'right';
			if (e.clientY > rect.top - threshold && e.clientY < rect.top + threshold)
				direction = 'top';
			if (
				e.clientY > rect.bottom - threshold &&
				e.clientY < rect.bottom + threshold
			)
				direction = 'bottom';

			if (
				e.clientX > rect.left - threshold &&
				e.clientX < rect.left + threshold &&
				e.clientY > rect.top - threshold &&
				e.clientY < rect.top + threshold
			)
				direction = 'top-left';

			if (
				e.clientX > rect.right - threshold &&
				e.clientX < rect.right + threshold &&
				e.clientY > rect.top - threshold &&
				e.clientY < rect.top + threshold
			)
				direction = 'top-right';

			if (
				e.clientX > rect.left - threshold &&
				e.clientX < rect.left + threshold &&
				e.clientY > rect.bottom - threshold &&
				e.clientY < rect.bottom + threshold
			)
				direction = 'bottom-left';

			if (
				e.clientX > rect.right - threshold &&
				e.clientX < rect.right + threshold &&
				e.clientY > rect.bottom - threshold &&
				e.clientY < rect.bottom + threshold
			)
				direction = 'bottom-right';

			if (direction !== null) {
				initialMousePosition.current = { x: e.clientX, y: e.clientY };
				setResizeDirection(direction);
			}
		},
		[resizable]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing || !blockRef.current || resizeDirection === null) return;

			const deltaX = e.clientX - initialMousePosition.current.x;
			const deltaY = e.clientY - initialMousePosition.current.y;
			initialMousePosition.current = { x: e.clientX, y: e.clientY };

			const rect = blockRef.current.getBoundingClientRect();
			let newWidth = rect.width;
			let newHeight = rect.height;
			let newLeft = rect.left;
			let newTop = rect.top;

			switch (resizeDirection) {
				case 'left':
					newWidth -= deltaX;
					newLeft += deltaX;
					break;
				case 'right':
					newWidth += deltaX;
					break;
				case 'top':
					newHeight -= deltaY;
					newTop += deltaY;
					break;
				case 'bottom':
					newHeight += deltaY;
					break;
				case 'top-left':
					newWidth -= deltaX;
					newLeft += deltaX;
					newHeight -= deltaY;
					newTop += deltaY;
					break;
				case 'top-right':
					newWidth += deltaX;
					newHeight -= deltaY;
					newTop += deltaY;
					break;
				case 'bottom-left':
					newWidth -= deltaX;
					newLeft += deltaX;
					newHeight += deltaY;
					break;
				case 'bottom-right':
					newWidth += deltaX;
					newHeight += deltaY;
					break;
				default:
					break;
			}

			if (newWidth < 0) {
				newWidth = 0;
			}
			if (newHeight < 0) {
				newHeight = 0;
			}

			setBlockSize({ width: newWidth, height: newHeight });

			if (blockRef.current && blockRef.current.style) {
				blockRef.current.style.minWidth = `${newWidth}px`;
			}
			if (blockRef.current && blockRef.current.style) {
				blockRef.current.style.minHeight = `${newHeight}px`;
			}
		},
		[isResizing, resizeDirection]
	);

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
		onResize && onResize(false);
		setResizeDirection(null);
	}, []);

	const handleResize = useCallback(() => {
		if (blockRef.current) {
			const newWidth = blockRef.current.offsetWidth;
			const newHeight = blockRef.current.offsetHeight;
			setBlockSize({ width: newWidth, height: newHeight });
		}
	}, []);

	useEffect(() => {
		if (!blockRef.current) return;

		if (resizable) {
			blockRef.current.addEventListener('mousedown', handleMouseDown as any);
			document.addEventListener('mousemove', handleMouseMove as any);
			document.addEventListener('mouseup', handleMouseUp);
		}
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => {
			if (blockRef.current && resizable) {
				blockRef.current.removeEventListener(
					'mousedown',
					handleMouseDown as any
				);
				document.removeEventListener('mousemove', handleMouseMove as any);
				document.removeEventListener('mouseup', handleMouseUp);
			}
			window.removeEventListener('resize', handleResize);
		};
	}, [
		handleMouseMove,
		handleMouseDown,
		handleMouseUp,
		handleResize,
		resizable,
	]);

	return [blockRef, blockSize];
}
