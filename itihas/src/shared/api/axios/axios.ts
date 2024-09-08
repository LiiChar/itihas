import axios from 'axios';
import { authTokenInterceptor } from './interceptors/authInterceptores';

const instanceAxios = axios.create({});

instanceAxios.interceptors.request.use(config => {
	config = authTokenInterceptor(config);
	return config;
});

export { instanceAxios as axi };
