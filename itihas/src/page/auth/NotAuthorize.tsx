export const NotAuthorize = ({ page = '' }: { page?: string }) => {
	return (
		<div className='content-height flex justify-center items-center'>
			<div className='bg-secondary/70 rounded-md w-1/3 h-1/2 flex justify-center items-center'>
				Зарегестрируйтесь, чтобы войти на страницу {page}
			</div>
		</div>
	);
};
