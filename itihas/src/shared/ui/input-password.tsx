import { Eye } from 'lucide-react';
import { Input } from './input';
import { useState } from 'react';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

export const InputPassword = React.forwardRef(
	({ ...arg }: React.InputHTMLAttributes<HTMLInputElement>) => {
		const [visiblePassword, setVisibliePassword] = useState(false);

		return (
			<div className='relative'>
				<Input {...arg} type={visiblePassword ? 'text' : 'password'} />
				<div
					className='absolute h-full w-9 flex items-center justify-center right-0 -top-2'
					onClick={() => setVisibliePassword(prev => !prev)}
				>
					{visiblePassword ? (
						<EyeClosedIcon className='h-5' />
					) : (
						<Eye className='h-5 fixed ' />
					)}
				</div>
			</div>
		);
	}
);
