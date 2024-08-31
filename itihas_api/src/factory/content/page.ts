import { faker } from '@faker-js/faker';
import { PageInsertType, PointPageInsertType } from '../../database/db';

export const pagesContent: PageInsertType[] = [
	{
		historyId: 1,
		id: 1,
		name: 'Пробуждение',
		description: 'Ты просыпаешься в заброшенной хижине в Зоне.',
		content:
			'Ты чувствуешь, как холодный воздух обдувает лицо. Вокруг туман и тишина. Ты понимаешь, что находишься в Зоне.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 2,
		name: 'Развилка',
		description:
			'Перед тобой две дороги: одна ведет к заводу, другая к деревне.',
		content:
			'Ты стоишь перед развилкой. Одна дорога ведет к старому заводу, другая - к заброшенной деревне. Куда пойти?',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 3,
		name: 'Завод',
		description: 'Ты подходишь к старому заводу.',
		content:
			'Завод выглядит заброшенным, но внутри что-то движется. Может быть, там сталкеры или мутанты.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 4,
		name: 'Встреча',
		description: 'Ты находишь двух сталкеров внутри завода.',
		content:
			'Двое сталкеров обсуждают что-то. Один из них держит в руках странный артефакт.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 5,
		name: 'Безопасность',
		description: 'Ты решаешь уйти и найти укрытие.',
		content:
			'Ты покидаешь завод и находишь заброшенный дом, где можно спрятаться.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 6,
		name: 'Тайна',
		description: 'Ты находишь старую карту в заброшенном доме.',
		content:
			'Ты находишь древнюю карту Зоны. Она может указать на безопасные маршруты.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 7,
		name: 'Аномалия',
		description: 'Ты подходишь к аномалии, отмеченной на карте.',
		content:
			'Аномалия сверкает, воздух вокруг нее искрится. Вдали что-то движется.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 8,
		name: 'Выбор',
		description: 'Ты слышишь крик неподалеку от аномалии.',
		content:
			'Кто-то попал в беду. Ты слышишь крик неподалеку. Решение за тобой.',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 9,
		name: 'Спасение',
		description: 'Ты находишь сталкера, попавшего в аномалию.',
		content:
			'Сталкер попал в аномалию и нуждается в помощи. Успеешь ли ты его спасти?',
		image: faker.image.url(),
	},
	{
		historyId: 1,
		id: 10,
		name: 'Награда',
		description: 'Ты спас сталкера, и он предлагает помочь тебе.',
		content:
			'Сталкер благодарит тебя за спасение и предлагает свою помощь и информацию.',
		image: faker.image.url(),
	},
];

export const pointsPageContent: PointPageInsertType[] = [
	{
		name: 'Идти вперёд',
		action: 'move(2);',
		pageId: 1,
	},
	{
		name: 'Идти к старому заводу',
		action: 'move(3);',
		pageId: 2,
	},
	{
		name: 'Идти в заброшенную деревню',
		action: 'move(5);',
		pageId: 2,
	},
	{
		name: 'Подкрасться ближе и посмотреть',
		action: 'move(4);',
		pageId: 3,
	},
	{
		name: 'Зайти прямо внутрь',
		action: 'move(4);',
		pageId: 3,
	},
	{
		name: 'Попробовать подслушать их разговор',
		action: 'move(5);',
		pageId: 4,
	},
	{
		name: 'Выйти и уйти незамеченным',
		action: 'move(5);',
		pageId: 4,
	},
	{
		name: 'Обыскать дом в поисках припасов',
		action: 'move(6);',
		pageId: 5,
	},
	{
		name: 'Выйти наружу и продолжить путь',
		action: 'move(7);',
		pageId: 5,
	},
	{
		name: 'Взять карту с собой',
		action: 'move(7);',
		pageId: 6,
	},
	{
		name: 'Оставить карту на месте',
		action: 'move(7);',
		pageId: 6,
	},
	{
		name: 'Подойти ближе и исследовать',
		action: 'move(8);',
		pageId: 7,
	},
	{
		name: 'Обойти аномалию стороной',
		action: 'move(8);',
		pageId: 7,
	},
	{
		name: 'Пойти на звук крика',
		action: 'move(9);',
		pageId: 8,
	},
	{
		name: 'Продолжить двигаться дальше',
		action: 'move(7);',
		pageId: 8,
	},
	{
		name: 'Попробовать спасти его',
		action: 'move(10);',
		pageId: 9,
	},
	{
		name: 'Оставить его и уйти',
		action: 'move(7);',
		pageId: 9,
	},
];
