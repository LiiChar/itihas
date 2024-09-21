import React, { HTMLProps, memo } from 'react';
import { getFullUrl } from '../../../shared/lib/image';

type WallpaperProps = {
	className?: HTMLProps<HTMLDivElement>['className'];
	attributes?: React.HTMLAttributes<HTMLDivElement>;
	src: string;
};

export const Wallpaper = memo(
	({ attributes, className, src }: WallpaperProps) => {
		return (
			<div
				style={{ zIndex: -1 }}
				className={
					className +
					' absolute top-0  left-0 w-full h-full bg-gradient-to-t bg-transparentfrom-background bg-background md:max-h-[600px] m-auto'
				}
				{...attributes}
			>
				<img
					alt='wallpaper'
					// fetchPriority='high'
					decoding='async'
					style={{
						position: 'absolute',
						inset: 0,
						color: 'transparent',
						filter: 'blur(8px)',
						maskImage:
							'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 25%, transparent 100%)',
					}}
					className='w-full  h-full blur-4 object-cover  object-start mask-linear sm:mask-from-30 sm:mask-point-via-[30%] sm:mask-via-15 -top-14 sm:opacity-30'
					src={getFullUrl(src)}
				/>
			</div>
		);
	}
);
