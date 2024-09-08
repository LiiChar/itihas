export const authTokenInterceptor = (config: any) => {
	config.headers['X-Content-Type-Options'] = 'nosniff';
	return config;
};
