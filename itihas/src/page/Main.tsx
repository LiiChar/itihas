import React from 'react';
import { getHistories } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Link } from 'react-router-dom';
import { Slider } from '@/component/pages/Main/Slider';

export const Main = () => {
	const { data, isLoading } = useQuery(() => getHistories());
	if (!data) {
		return 'Loading...';
	}
	return (
		<div>
			<Slider histories={data!.data} title='Все истории' />
		</div>
	);
};
