import { Link } from 'react-router-dom';

export const Footer = () => {
	return (
		<footer className='mt-2'>
			<div className=''>
				<div className='flexpx-4'>
					<div className='w-1/3'>
						<div className='flex flex-col'></div>
					</div>
					<div className='w-1/3'></div>
					<div className='w-1/3'></div>
				</div>
				<div className=' border-t-[1px] border-foreground/40'>
					<div className='px-4 py-1 flex flex-wrap justify-between text-sm'>
						<Link to={'/privacy-police/'}>Политика конфиденциальности</Link>
						<Link to={'/copyright/'}>Авторское право</Link>
						<Link to={'/user-agreement/'}>Пользовательское соглашение</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
