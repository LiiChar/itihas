// import { ObjectVisualize } from '@/component/widget/visualizeResponse/ObjectVisualize';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { updateVariables } from '@/shared/api/variable';
import { formatData, minifyData } from '@/shared/lib/text';
import { runListener } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Variable as VType, VariableHistory } from '@/shared/type/variable';
import { Button } from '@/shared/ui/button';
import { CodeBlock } from '@/shared/ui/code-block';
import { Input } from '@/shared/ui/input';
import {
	Table,
	TableCaption,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableHeader,
} from '@/shared/ui/table';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
type DataVariable = Record<
	string,
	{
		key: string;
		data: string;
	}
>;

export const Variable = ({ variable }: { variable: VariableHistory[] }) => {
	const [variables, setVariables] = useState(
		Object.assign(changeDataToVariable(variable), {
			'': {
				data: '',
				key: '',
				type: 'string',
			},
		})
	);
	const { id } = useParams();
	const { user } = useUserStore();
	if (!(id && user && 'id' in user)) {
		return '';
	}
	const handleUpdateVar = (
		initKey: string,
		key: string,
		variable: string,
		type: VType['type']
	) => {
		setVariables(prev => {
			prev[initKey] = {
				key: key,
				data: variable,
				type,
			};
			return Object.assign({}, prev);
		});
	};

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Переменная</TableHead>
						<TableHead>Значение</TableHead>
						<TableHead>Тип</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(variables).map(([k, v], i) => (
						<TableRow key={k}>
							<TableCell>
								<Input
									defaultValue={v.key}
									onChange={e =>
										handleUpdateVar(
											k,
											e.currentTarget.value,
											v.data,
											v.type as 'string' | 'number' | 'object' | 'array'
										)
									}
								/>
							</TableCell>
							<TableCell>
								<Input
									value={formatData(
										v.type == 'object' || v.type == 'array'
											? JSON.parse(v.data)
											: v.data
									)}
									onChange={e =>
										handleUpdateVar(
											k,
											v.key,
											e.currentTarget.value,
											v.type as 'string' | 'number' | 'object' | 'array'
										)
									}
								/>
							</TableCell>
							<TableCell>
								<Select
									onValueChange={val => {
										handleUpdateVar(
											k,
											v.key,
											v.data,
											val as 'string' | 'number' | 'object' | 'array'
										);
									}}
									value={v.type}
								>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Выберите тип' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='string'>Строка</SelectItem>
											<SelectItem value='object'>Объект</SelectItem>
											<SelectItem value='number'>Число</SelectItem>
											<SelectItem value='array'>Массив</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className='mb-2'>
				<Button
					onClick={async () => {
						await updateVariables(changeDataToAction(variables), +id, user.id);
						runListener('variableUpdate');
					}}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
};

const changeDataToAction = (
	data: Record<string, { data: string; key: string; type: VType['type'] }>
) => {
	return Object.entries(data).reduce<
		Record<string, { data: string; key: string; type: VType['type'] }>
	>((acc, [k, ek]) => {
		if (!k) {
			acc[ek.key] = {
				data: ek.data,
				key: ek.key,
				type: ek.type,
			};
		} else {
			acc[k] = {
				data: ek.data,
				key: ek.key,
				type: ek.type,
			};
		}

		return acc;
	}, {});
};

const changeDataToVariable = (data: VariableHistory[]) => {
	return data.reduce<
		Record<string, { data: string; key: string; type: VType['type'] }>
	>((acc, el) => {
		acc[el.variable] = {
			data: el.data,
			key: el.variable,
			type: el.type,
		};
		return acc;
	}, {});
};

{
	/* {!editable && (
				<div>
					{variables.map((v, i) => (
						<div className='flex gap-2'>
							<div
								onInput={e =>
									setVariables(state => {
										if (!e) {
											return state;
										}
										if (!e.currentTarget) {
											return state;
										}
										if (!e.currentTarget.textContent) {
											return state;
										}
										state[i].variable = e.currentTarget.textContent;
										return Object.assign({}, state);
									})
								}
								contentEditable={editable}
							>
								{v.variable}:
							</div>
							<div
								onInput={e =>
									setVariables(state => {
										if (!e) {
											return state;
										}
										if (!e.currentTarget) {
											return state;
										}
										if (!e.currentTarget.textContent) {
											return state;
										}
										state[i].data = e.currentTarget.textContent;

										return Object.assign({}, state);
									})
								}
							>
								<ObjectVisualize
									objects={JSON.parse(v.data)}
									editable={editable}
									onSet={(variable: VariableHistory[]) =>
										setVariables(variable as any)
									}
								/>
							</div>
						</div>
					))}
				</div>
			)} */
}
