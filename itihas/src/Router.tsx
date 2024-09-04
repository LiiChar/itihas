import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Main } from './page/Main';
import { History } from './page/History';
import { Read } from './page/Read';
import { PageEditBoard } from './page/Read/EditBoard';
import { HistoryEditBoard } from './page/History/EditBoard';

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
	{
		path: '/history/:id/edit',
		element: <HistoryEditBoard />,
	},
	{
		path: '/page/:id/edit',
		element: <PageEditBoard />,
	},
]);

export const Router = () => {
	return <RouterProvider router={router} />;
};
