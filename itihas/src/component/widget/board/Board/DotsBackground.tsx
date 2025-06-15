import dot from '@/assets/dot.png';

export const DotsBackground = () => {
	return (
		<div
			className='bg-repeat bg-transparent absolute top-0 left-0 w-full h-full'
			style={{ backgroundImage: `url(${dot})` }}
		></div>
	);
};
