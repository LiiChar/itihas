export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate();
}

export const getDaysFromYear = (year: number) => {
	return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
};

export const getTime = (sec: number): string => {
	let time = '';
	if (sec / 360 >= 1) {
		time += Math.floor(sec / 360);
		time += ':';
		sec = sec % 360;
	}
	if (sec / 60 >= 1) {
		time += Math.floor(sec / 60);
		time += ':';
		sec = sec % 60;
	} else {
		time += 0;
		time += ':';
	}
	if (sec <= 10) {
		time += 0;
	}
	time += Math.trunc(sec);
	return time;
};

export const getMonthDayFromDayOfYear = (year: number, dayOfYear: number) => {
	// Создаем новый объект Date, передавая в конструктор год, 0-й месяц и день (также можно передать 1-е января года)
	const date = new Date(year, 0, 3); // 0-й день отсчитывается от 1970 года, так что это день перед 1 января year года
	date.setDate(dayOfYear + 1); // Устанавливаем нужный день от начала года

	// Получаем месяц и день из объекта Date
	const month = date.getMonth(); // Месяцы отсчитываются от 0, поэтому добавляем 1
	const day = date.getDate();

	return [month, day];
};

export const getTimeAgo = (date: Date | string) => {
	const now = new Date();
	const messageTime = new Date(date);

	const timeDifference = now.getTime() - messageTime.getTime();
	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60) + new Date().getTimezoneOffset();
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) {
		return `${years} ${years === 1 ? 'год' : 'года'} назад`;
	} else if (months > 0) {
		return `${months} ${months === 1 ? 'месяц' : 'месяца'} назад`;
	} else if (days > 7) {
		return `${Math.floor(days / 7)} ${
			Math.floor(days / 7) === 1 ? 'неделю' : 'недели'
		} назад`; // Если прошло больше недели, показываем полную дату
	} else if (days > 0) {
		return `${days} ${days === 1 ? 'день' : 'дня'} назад`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? 'час' : 'часа'} назад`;
	} else if (minutes > 0) {
		return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`;
	} else {
		return 'меньше минуты назад';
	}
};

export const timer = async (time: number) => {
	return new Promise((res, _rej) => {
		setTimeout(() => {
			res('');
		}, time);
	});
};

export const getDayOfYear = (dates: Date | string) => {
	const date = new Date(dates);

	const start = new Date(date.getFullYear(), 0, 0);
	const diff = date.getTime() - start.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);
	return dayOfYear;
};

export const formatDate = (inputDate: string, short: boolean = false) => {
	if (!inputDate) return inputDate;
	// Создаем объект Date из входной строки
	const date = new Date(inputDate);

	// Определяем массивы с названиями месяцев и их сокращениями
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	];
	const shortMonths = [
		'янв',
		'фев',
		'мар',
		'апр',
		'мая',
		'июн',
		'июл',
		'авг',
		'сен',
		'окт',
		'ноя',
		'дек',
	];

	// Получаем день, месяц и год из объекта Date
	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();

	// Собираем строку в нужном формате
	const formattedDate =
		day + ' ' + (short ? shortMonths : months)[monthIndex] + ' ' + year + ' г.';

	return formattedDate;
};
