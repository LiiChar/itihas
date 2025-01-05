function generateUniqueId(): string {
	return '_' + Math.random().toString(36).substr(2, 9);
}

type WithId<T> = T extends object ? T & { id: string } : T;

export type UniqueType<T> = T extends object
	? T extends Array<infer U>
		? Array<WithId<U>>
		: WithId<T>
	: T;

export function addUniqueId<T>(input: T): UniqueType<T> {
	if (Array.isArray(input)) {
		// Обрабатываем массив объектов
		return input.map(item => addUniqueId(item)) as UniqueType<T>;
	} else if (typeof input === 'object' && input !== null) {
		// Создаем копию объекта, чтобы не мутировать исходный
		const result: Record<string, any> = Object.assign(input, {
			id: generateUniqueId(),
		});

		// Рекурсивно добавляем id ко всем вложенным объектам и массивам
		for (const key in result) {
			if (Array.isArray(result[key])) {
				result[key] = addUniqueId(result[key]);
			} else if (typeof result[key] === 'object' && result[key] !== null) {
				result[key] = addUniqueId(result[key]);
			}
		}
		return result as UniqueType<T>;
	} else {
		return input as any;
	}
}

type NestedObjectId = {
	id: string;
};

export function findObjectById<T extends NestedObjectId>(
	items: T[],
	targetId: string
): T | undefined {
	const stack: T[] = [...items];

	while (stack.length > 0) {
		const current = stack.pop();

		if (current && typeof current === 'object') {
			if ('id' in current && current.id === targetId) {
				return current as T;
			}

			for (const key in current) {
				if (Array.isArray(current[key] as T[])) {
					stack.push(...(current[key] as T[]));
				} else if (typeof current[key] === 'object' && current[key] !== null) {
					stack.push(current[key] as T);
				}
			}
		}
	}

	return undefined;
}

type PathSegment = string | number;

export function findObjectByIdWithPath<T extends NestedObjectId>(
	items: T[],
	targetId: string
): { item: T; path: PathSegment[] } | undefined {
	const stack: Array<{ item: T; path: PathSegment[] }> = items.map(
		(item, i) => ({
			item,
			path: [i],
		})
	);

	while (stack.length > 0) {
		const { item: current, path } = stack.pop()!;

		if (current && typeof current === 'object') {
			if ('id' in current && current.id === targetId) {
				return { item: current as T, path };
			}

			for (const key in current) {
				if (Array.isArray(current[key])) {
					(current[key] as T[]).forEach((childItem, index) => {
						stack.push({
							item: childItem,
							path: [...path, key, index],
						});
					});
				} else if (
					typeof current[key] === 'object' &&
					current[key] !== null &&
					(current[key] as T).id
				) {
					stack.push({
						item: current[key] as T,
						path: [...path, key],
					});
				}
			}
		}
	}

	return undefined;
}

export function updateObjectByPath<T extends Record<string, any> | any[], V>(
	obj: T,
	path: string[],
	newValue: V
): T {
	if (!obj) {
		return obj; // или можно выбросить ошибку
	}

	if (path.length === 0) {
		return newValue as unknown as T;
	}

	const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
	let current = newObj;
	const lastIndex = path.length - 1;

	for (let i = 0; i < path.length; i++) {
		const key = path[i];

		if (i === lastIndex) {
			if (Array.isArray(current)) {
				const index = parseInt(key, 10);
				current[index] = newValue;
			} else {
				current[key] = newValue;
			}
		} else {
			if (Array.isArray(current)) {
				const index = parseInt(key, 10);
				if (
					current[index] === undefined ||
					typeof current[index] !== 'object'
				) {
					current[index] = {} as any;
				}
				current = current[index];
			} else {
				if (current[key] === undefined || typeof current[key] !== 'object') {
					current[key] = {} as any;
				}
				current = current[key];
			}
		}
	}

	return newObj as T;
}

export function swapElementsByPaths<T extends Record<string, any> | any[]>(
	path1: string[],
	path2: string[],
	obj: T
): T {
	if (!obj) {
		return obj;
	}

	if (path1.length === 0 || path2.length === 0) {
		return obj;
	}

	const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

	const value1 = getValueByPath(newObj, path1);
	const value2 = getValueByPath(newObj, path2);

	const updatedObj = updateObjectByPath(newObj, path1, value2);
	return updateObjectByPath(updatedObj, path2, value1) as any;
}

function getValueByPath<T>(obj: T, path: string[]): any {
	if (!obj) {
		return undefined;
	}

	let current: any = obj;

	for (let i = 0; i < path.length; i++) {
		const key: any = path[i];
		if (
			current === null ||
			current === undefined ||
			typeof current !== 'object'
		) {
			return undefined;
		}

		if (Array.isArray(current)) {
			const index = parseInt(key, 10);
			current = current[index];
		} else {
			current = current[key];
		}
	}

	return current;
}

export function removeObjectById<T extends Record<string, any> | any[]>(
	obj: T,
	id: any,
	idKey: string = 'id'
): T {
	if (!obj) {
		return obj;
	}

	const newObj: T = Array.isArray(obj) ? ([...obj] as T) : { ...obj };

	const stack = [newObj];

	while (stack.length > 0) {
		const current = stack.pop();

		if (Array.isArray(current)) {
			for (let i = 0; i < current.length; i++) {
				const item = current[i];
				if (typeof item === 'object' && item !== null) {
					if (item[idKey] === id) {
						current.splice(i, 1);
						i--;
					} else {
						stack.push(item);
					}
				}
			}
		} else if (typeof current === 'object' && current !== null) {
			for (const key in current) {
				if (current.hasOwnProperty(key)) {
					const value: any = current[key];
					if (typeof value === 'object' && value !== null) {
						if (value[idKey] === id) {
							delete current[key];
						} else {
							stack.push(value);
						}
					}
				}
			}
		}
	}

	return newObj;
}
