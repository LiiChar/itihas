import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Main } from './page/Main';
import { History } from './page/History';
import { Read } from './page/Read';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Main />,
	},
	{
		path: '/history/:id',
		element: <History />,
	},
	{
		path: '/history/:id/read',
		element: <Read />,
	},
]);

export const Router = () => {
	return <RouterProvider router={router} />;
};
