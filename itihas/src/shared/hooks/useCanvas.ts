import { RefObject, useRef } from 'react';

type UseCanvas = {
	ref: RefObject<HTMLCanvasElement>;
};

export const useCanvas = (): UseCanvas => {
	const ref = useRef<HTMLCanvasElement>(null);

	return;
};
