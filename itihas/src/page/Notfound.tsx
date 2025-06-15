import { Link } from 'react-router-dom';

export const Notfound = () => {
	return (
		<div className='w-full h-full flex content-height justify-center items-center'>
			<div className='w-1/2 bg-secondary/60 p-4 rounded-sm'>
				<h2>Страница не найдена</h2>
				<p>
					Страницы по данному пути не найдено, измените url или вернитесь на
					главную страницу
				</p>
				<div>
					<div>
						<Link to={'/'}>На главную</Link>
					</div>
					<div></div>
				</div>
			</div>
		</div>
	);
};
