export const authTokenInterceptor = (config: any) => {
	const authToken = localStorage.getItem('authToken');
	if (authToken) {
		// config.headers.authorization = `Bearer ${authToken}`;
	}
	return config;
};
