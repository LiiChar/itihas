import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';
import { getFullUrl } from '../../../shared/lib/image';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const Similar = memo(({ history }: { history: HistoryPages }) => {
	return (
		<section>
			<div className='flex items-center'>
				<h4>Похожее</h4>
				<div>
					<Button
						variant='link'
						className='font-normal text-primary normal-case'
					>
						Добавить
					</Button>
				</div>
			</div>
			{history.similarHistories.map(s => (
				<div key={s.id} className='flex gap-1'>
					<div>
						<img
							width={75}
							height={105}
							src={getFullUrl(s.similarHistory.image)}
							alt={`Похожая история ${s.similarHistory.name}`}
						/>
					</div>
					<div className='flex flex-col justify-between py-2'>
						<div>{s.similarHistory.name}</div>
						<div className='flex gap-1 items-center justify-between'>
							<div>
								<Minus />
							</div>
							<div>{s.similar ?? 0}</div>
							<div>
								<Plus />
							</div>
						</div>
					</div>
				</div>
			))}
		</section>
	);
});
