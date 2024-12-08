import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';
import { getFullUrl, handleImageError } from '../../../shared/lib/image';
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
				<div key={s.id} className='flex flex-col gap-1'>
					<div className='flex justify-between'>
						<div className='w-full'>
							<img
								src={getFullUrl(s.similarHistory.image)}
								onError={handleImageError}
								className='w-full max-w-36'
								alt={`Похожая история ${s.similarHistory.name}`}
							/>
							<div className='flex justify-between py-2'>
								<div>{s.similarHistory.name}</div>
							</div>
						</div>

						<div className='flex flex-col gap-1 items-center'>
							<Plus width={14} height={14} />
							<div>{s.similar ?? 0}</div>
							<Minus width={14} height={14} />
						</div>
					</div>
				</div>
			))}
			{history.similarHistories.length == 0 && (
				<div>На него никто не похож</div>
			)}
		</section>
	);
});
