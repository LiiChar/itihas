import { InternalAxiosRequestConfig } from 'axios';

export const authTokenInterceptor = (
	config: InternalAxiosRequestConfig<any>
) => {
	config.headers['X-Content-Type-Options'] = 'nosniff';
	return config;
};
