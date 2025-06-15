import React from 'react';

interface HealthBarProps {
	health: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
	return (
		<div className='w-48 h-4 bg-gray-700 rounded-full overflow-hidden mt-2'>
			<div
				className='h-full bg-green-500 transition-all duration-300'
				style={{ width: `${health}%` }}
			></div>
		</div>
	);
};

export default HealthBar;
