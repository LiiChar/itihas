// import { ObjectVisualize } from '@/component/widget/visualizeResponse/ObjectVisualize';
import { updateVariables } from '@/shared/api/variable';
import { runListener } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { VariableHistory } from '@/shared/type/variable';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const Variable = ({ variable }: { variable: VariableHistory[] }) => {
	const [editable, _setEditable] = useState(true);
	const [variables, setVariables] = useState(() =>
		variable.map(v => Object.assign({ initileVariable: v.variable }, v))
	);
	const { id } = useParams();
	const { user } = useUserStore();
	if (!(id && user && 'id' in user)) {
		return '';
	}
	return (
		<div>
			<div>
				{variables.map((v, i) => (
					<div className='flex'>
						<Input
							value={v.variable}
							onChange={e =>
								setVariables(state => {
									state[i].variable = e.target.value;
									return [...state];
								})
							}
						/>
						<Input
							value={v.data}
							onChange={e =>
								setVariables(state => {
									state[i].data = e.target.value;
									return [...state];
								})
							}
						/>
					</div>
				))}
			</div>

			{/* <div>
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
								onSet={(variable: VariableHistory[]) => setVariables(variable)}
							/>
						</div>
					</div>
				))}
			</div> */}
			{editable && (
				<div>
					<Button
						onClick={async () => {
							await updateVariables(
								changeDataToAction(variables),
								+id,
								user.id
							);
							runListener('variableUpdate');
						}}
					>
						Сохранить
					</Button>
				</div>
			)}
		</div>
	);
};

const changeDataToAction = (
	data: ({ initileVariable: string } & VariableHistory)[]
) => {
	return data.reduce<Record<any, any>>((acc, el) => {
		acc[el.initileVariable] = {
			data: el.data,
			key: el.variable,
		};
		return acc;
	}, {});
};
