import { useState } from 'react';

// Тип для предмета
type Item = {
	id: number;
	name: string;
	effect: {
		health?: number;
		defense?: number;
	};
};

// Пропсы для компонента Inventory
type InventoryProps = {
	items: Item[];
	onUseItem: (item: Item) => void;
};

const Inventory = ({ items, onUseItem }: InventoryProps) => {
	return (
		<div className='inventory p-4 bg-gray-800 rounded-lg shadow-lg'>
			<h3 className='text-white text-lg font-bold mb-4'>Инвентарь</h3>
			{items.length > 0 ? (
				<ul className='space-y-2'>
					{items.map(item => (
						<li
							key={item.id}
							className='flex justify-between items-center bg-gray-700 p-2 rounded'
						>
							<span className='text-white'>{item.name}</span>
							<button
								onClick={() => onUseItem(item)}
								className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
							>
								Использовать
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className='text-white'>Инвентарь пуст</p>
			)}
		</div>
	);
};

export default Inventory;
