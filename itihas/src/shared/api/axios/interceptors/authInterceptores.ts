import { InternalAxiosRequestConfig } from 'axios';

export const authTokenInterceptor = (
	config: InternalAxiosRequestConfig<any>
) => {
	const authToken = localStorage.getItem('authToken');
	if (authToken) {
		config.headers.authorization = `Bearer ${authToken}`;
	}
	return config;
};
