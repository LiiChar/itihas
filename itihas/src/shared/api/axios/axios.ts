import axios from 'axios';
import { authTokenInterceptor } from './interceptors/authInterceptores';
import { toast } from 'sonner';

const instanceAxios = axios.create({
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},

	transformResponse(res: any) {
		const data = JSON.parse(res);

		if (data && Object.keys(data).length === 1 && typeof data == 'object') {
			if ('message' in data && typeof data.message == 'string') {
				toast.info(data.message);
			}
			if ('error' in data && typeof data.error == 'string') {
				toast.error(data.error);
			}
		}
		return data;
	},
});

instanceAxios.interceptors.request.use(config => {
	config = authTokenInterceptor(config);
	return config;
});

export { instanceAxios as axi };
