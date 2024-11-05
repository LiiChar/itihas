import { useLayout } from '@/shared/hooks/useLayout';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type TokenName = 'move' | 'query' | 'var' | 'get';

type Token = {
	token: TokenName;
	children: (Token | string)[];
};

type Tokens = Token[];

function parse(input: string): Tokens {
	const result: Tokens = [];
	const stack: Tokens = [];
	let currentToken: string = '';

	for (let char of input) {
		if (char === '(') {
			// Когда встречается открывающая скобка, создаём новый уровень вложенности
			stack.push({ token: currentToken as TokenName, children: [] });
			currentToken = '';
		} else if (char === ')') {
			// При закрывающей скобке проверяем, есть ли текущий токен
			if (currentToken) {
				stack[stack.length - 1].children.push(currentToken);
				currentToken = '';
			}

			const lastLevel = stack.pop();
			if (lastLevel && lastLevel.token) {
				if (stack.length > 0) {
					stack[stack.length - 1].children.push(lastLevel);
				} else {
					result.push(lastLevel);
				}
			}
		} else if (char === ',') {
			// Запятая - разделитель значений
			if (currentToken) {
				stack[stack.length - 1].children.push(currentToken);
				currentToken = '';
			}
		} else if (char === ';') {
			// Игнорируем
			continue;
		} else {
			currentToken += char; // Собираем текущий токен
		}
	}

	// Обрабатываем оставшийся токен, если он существует
	if (currentToken) {
		if (stack.length > 0) {
			stack[stack.length - 1].children.push(currentToken);
		} else {
			result.push({ token: currentToken as TokenName, children: [] });
		}
	}

	return result;
}

// Компонент
const DisplayTokens = ({ data }: { data: Tokens }) => {
	return (
		<div>
			{data.map((item, index) => (
				<>
					<span key={index}>{WordConvert(item)}</span>
				</>
			))}
		</div>
	);
};

const phrases = {
	get: {
		default: `Получить значение из локальной среды по ключу [key]. `,
		get: `полученным их локальной стреды по ключу [key]`,
		move: ` по ключу [key] полученным их локальной стреды`,
		query: `полученной из локальной стреды по ключу [key]`,
		var: `полученной из локальной стреды по ключу [key]`,
	},
	move: {
		default: `Перейти на страницу [key]. `,
		get: `полученным их локальной стреды по ключу [key]`,
		move: ` по ключу [key] полученным их локальной стреды`,
		query: `полученной из локальной стреды по ключу [key]`,
		var: `полученной из локальной стреды по ключу [key]`,
	},
	var: {
		default: `Сохранить в локальной среде значение [value] в переменной [key]. `,
		get: `Сохранить в локальной среде значение [value] в переменной [key]`,
		move: `Сохранить в локальной среде значение [value] в переменной [key]`,
		query: `Сохранить в локальной среде значение [value] в переменной [key]`,
		var: `Сохранить в локальной среде значение [value] в переменной [key]`,
	},
	query: {
		default: `Получить глобальные данные из переменной [key]. `,
		get: `полученной из глобальной стреды по ключу [key]`,
		move: ` по ключу [key] полученным их глобальной стреды`,
		query: `полученной из глобальной стреды по ключу [key]`,
		var: `полученной из глобальной стреды по ключу [key]`,
	},
};

const WordConvert = (token: Token | string, parent?: TokenName): string => {
	if (token == undefined) {
		return '';
	}
	if (typeof token === 'string') {
		return token;
	}
	if (typeof token.children == undefined || token.children.length == 0) {
		return 'false';
	}
	if (token.token == 'get') {
		if (typeof token.children[0] != undefined) {
			const firstValue = WordConvert(token.children[0], 'get');

			return phrases[token.token][parent ?? 'default'].replace(
				'[key]',
				firstValue
			);
		}
	}
	if (token.token == 'move') {
		if (typeof token.children[0] != undefined) {
			const firstValue = WordConvert(token.children[0], 'move');
			return phrases[token.token][parent ?? 'default'].replace(
				'[key]',
				firstValue
			);
		}
	}
	if (token.token == 'query') {
		if (typeof token.children[0] != undefined) {
			const firstValue = WordConvert(token.children[0], 'query');
			return phrases[token.token][parent ?? 'default'].replace(
				'[key]',
				firstValue
			);
		}
	}
	if (token.token == 'var') {
		if (
			typeof token.children[0] != undefined &&
			typeof token.children[1] != undefined
		) {
			const firstValue = WordConvert(token.children[0], 'var');
			const secondValue = WordConvert(token.children[1], 'var');
			return phrases[token.token][parent ?? 'default']
				.replace('[key]', firstValue)
				.replace('[value]', secondValue);
		}
	}
	return '';
};

const AsideDefaultBlock = () => {
	return;
};

const reverseTransform = (text: string) => {
	const stack: string[] = text.split('.').reverse();
	let result = '';

	for (let i = 0; i < stack.length; i++) {
		if (stack.length == 0) return;
		const t = stack.pop()!;
		if (t.trim() == '') return;
		Object.entries(phrases).forEach(([token, innerPhrases]) => {
			let key: null | string = null;
			let value: null | string = null;
			Object.values(innerPhrases).forEach(phrase => {
				// Проверка на шаблонное слово
				if (phrase.indexOf('[key]') > -1) {
					const startPhrase = phrase.slice(0, phrase.indexOf('[key]'));
					if (!t.includes(startPhrase)) return;
					if (phrase.indexOf('[value]') > -1) {
						const endPhrase = phrase.slice(
							startPhrase.length + 4,
							phrase.length - startPhrase.length + 4
						);
						const betweenPhrase = phrase.slice(
							startPhrase.length + 4,
							phrase.indexOf('[value]')
						);
						if (!t.includes(betweenPhrase)) return;
						if (!t.includes(endPhrase)) return;
						key = t.slice(startPhrase.length, t.indexOf(betweenPhrase)).trim();
						value = t.slice(betweenPhrase.length, t.indexOf(endPhrase)).trim();
						if (t.length - key.length > phrase.length - 5)
							stack.push(
								t.slice(t.length - key.length - phrase.length - 5, t.length)
							);
					} else {
						const endPhrase = phrase.slice(
							startPhrase.length + 5,
							phrase.length - startPhrase.length + 10
						);
						if (!t.includes(endPhrase)) return;
						key = t.slice(startPhrase.length, t.indexOf(endPhrase)).trim();
						console.log(t, key);
						if (t.length - key.length > phrase.length - 5)
							stack.push(
								t.slice(t.length - key.length - phrase.length - 5, t.length)
							);
					}
				}
			});
			if (!key && !value) return;
			const children: string[] = [];
			key && children.push(key);
			value && children.push(value);
			result += `${token}(${children.join(',')});`;
		});
	}
	return result;
};

export const Editor = () => {
	const inputString = 'var(id,5);move(get(id););';
	useLayout({ footer: true });
	const [data, setData] = useState(parse(inputString));
	reverseTransform(data.reduce<string>((acc, el) => acc + WordConvert(el), ''));

	return (
		<div>
			<h1>Визуальный дисплей объекта</h1>
			<div>
				<DisplayTokens data={data} />
			</div>
		</div>
	);
};
