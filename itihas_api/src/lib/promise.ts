export const seqRunner = function (deeds: (() => any)[]) {
	return deeds.reduce<any>(function (p, deed) {
		return p.then(function () {
			// Выполняем следующую функцию только после того, как отработала
			// предыдущая.
			return deed();
		});
	}, Promise.resolve()); // Инициализируем очередь выполнения.
};
