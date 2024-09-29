import { useParallax } from '@siberiacancode/reactuse';
import LayerBase from '@/assets/auth/layer-base.png';
import LayerMiddle from '@/assets/auth/layer-middle.png';
import LayerFrond from '@/assets/auth/layer-front.png';
import { CSSProperties } from 'react';

export const Background = ({ text }: { text: string[] }) => {
	const parallax = useParallax<HTMLDivElement>();

	const layerBase: CSSProperties = {
		position: 'absolute',
		height: '100%',
		width: '100%',
		transition: '.3s ease-out all',
	};

	const layer0 = {
		...layerBase,
		transform: `translateX(${parallax.value.tilt * 2}px) translateY(${
			parallax.value.roll * 4
		}px)`,
		zIndex: 10,
	};

	const layer1 = {
		...layerBase,
		transform: `translateX(${parallax.value.tilt * 5}px) translateY(${
			parallax.value.roll * 30
		}px)`,
		zIndex: 40,
	};

	const layer2 = {
		...layerBase,
		transform: `translateX(${parallax.value.tilt * 10}px) translateY(${
			parallax.value.roll * 40
		}px)`,
		zIndex: 50,
	};
	return (
		<div className='w-full h-full relative overflow-hidden' ref={parallax.ref}>
			<div className='flex absolute z-30 flex-col justify-center items-center w-full h-full'>
				{text.map((t, i) => (
					<div key={t} className={i == 0 ? 'text-2xl' : ''}>
						{t}
					</div>
				))}
			</div>
			<img style={layer0} src={LayerBase} alt='layer0' />
			<img style={layer1} src={LayerMiddle} alt='layer1' />
			<img style={layer2} src={LayerFrond} alt='layer2' />
		</div>
	);
};
