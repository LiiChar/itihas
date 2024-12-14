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
					<div className='px-4 py-1 flex justify-between text-sm'>
						<div>Политика конфиденциальности </div>
						<div>Авторское право</div>
						<div>Пользовательское соглашение</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
