import { VariableHistory } from '@/shared/type/variable';
import { TriangleDownIcon, TriangleRightIcon } from '@radix-ui/react-icons';
import { memo, useState } from 'react';

type ObjectVisualizeProps = {
	objects: Record<string, any>;
	onSet?: (variable: VariableHistory[]) => void;
	editable?: boolean;
};

export const ObjectVisualize = memo(({ objects }: ObjectVisualizeProps) => {
	const [object, _setObject] = useState<any>(objects);
	const [hiddenElement, setHiddenElement] = useState<number[]>([]);

	const handleHiddenElement = (layer: number) => {
		if (hiddenElement.includes(layer)) {
			const filteredHiddenElement = hiddenElement.filter(el => el != layer);
			setHiddenElement([...filteredHiddenElement]);
		} else {
			setHiddenElement(el => [...el, layer]);
		}
	};

	const getTypeAndCount = (val: any): any => {
		if (typeof val == 'object') {
			return `Object(${Object.entries(val!).length})`;
		}
		if (Array.isArray(val)) {
			return `Array(${val.length})`;
		}
	};

	const visibleObjectLayer = (value: unknown, layer: number): any => {
		if (
			typeof value != 'function' &&
			typeof value != 'object' &&
			!Array.isArray(value)
		) {
			if (typeof value == 'string') {
				return <span className='text-blue-600'>{value},</span>;
			}
			if (typeof value == 'number') {
				return <span className='text-primary'>{value},</span>;
			}
		}

		const isPrimaryVariable = (value: any) => {
			return typeof value == 'string' || typeof value == 'number';
		};

		const arrayId = layer - 2;
		const objectId = layer + 2;

		if (typeof value == 'object' && !Array.isArray(value)) {
			return (
				<>
					{
						<span>
							{'{'}
							{Object.entries(value!).map(([key, values], i) => (
								<div
									data-attr={objectId}
									key={key + values + i + objectId}
									className='ml-4 flex gap-1'
								>
									<>
										{!isPrimaryVariable(values) && (
											<span
												className='cursor-pointer -translate-x-full text-accent-foreground'
												onClick={() => handleHiddenElement(objectId + i)}
											>
												{hiddenElement.includes(objectId + i) ? (
													<span>
														<TriangleDownIcon className='inline' />
														<span className='text-primary'>
															{getTypeAndCount(value)}
														</span>
													</span>
												) : (
													<span>
														<TriangleRightIcon className='inline' />
														<span className='text-primary'>
															{getTypeAndCount(value)}
														</span>
													</span>
												)}
											</span>
										)}
										{!hiddenElement.includes(objectId + i) && (
											<span className='flex gap-1'>
												<span className='block'>{key}:</span>
												<span className='block'>
													{visibleObjectLayer(
														values,
														objectId + i + Object.entries(values!).length
													)}
												</span>
											</span>
										)}
									</>
								</div>
							))}
							{'},'}
						</span>
					}
				</>
			);
		}

		if (Array.isArray(value)) {
			const array: any[] = value;
			return (
				<>
					{
						<span>
							{` [`}
							<span
								className='cursor-pointer px-2 -translate-x-full text-primary'
								onClick={() => handleHiddenElement(arrayId - 1)}
							>
								{!hiddenElement.includes(arrayId - 1) ? (
									<span>
										<TriangleDownIcon className='inline' />
									</span>
								) : (
									<span>
										<TriangleRightIcon className='inline' />
									</span>
								)}
								{`Array(${array.length})`}
							</span>
							{!hiddenElement.includes(arrayId - 1) &&
								array.map((el, i) => (
									<div
										data-attr={arrayId}
										key={el + i + arrayId}
										className='ml-3'
									>
										{!isPrimaryVariable(el) && (
											<span
												className='cursor-pointer -translate-x-full text-accent-foreground'
												onClick={() => handleHiddenElement(arrayId + i)}
											>
												{!hiddenElement.includes(objectId + i + 1) ? (
													<span>
														<TriangleDownIcon className='inline' />
														<span className='text-sm mr-1'>{i}:</span>
														<span className='text-primary'>
															{getTypeAndCount(el)}
														</span>
														<br />
													</span>
												) : (
													<span>
														<TriangleRightIcon className='inline' />
														<span className='text-sm mr-1'>{i}:</span>
														<span className='text-primary'>
															{getTypeAndCount(el)}
														</span>
														<br />
													</span>
												)}
											</span>
										)}
										{hiddenElement.includes(arrayId + i) && (
											<span>
												{visibleObjectLayer(el, arrayId + i + array.length)}
											</span>
										)}
									</div>
								))}
							{'],'}
						</span>
					}
				</>
			);
		}
	};

	return <div>{visibleObjectLayer(object, 0)}</div>;
});
