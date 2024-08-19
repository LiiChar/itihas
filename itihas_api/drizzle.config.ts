import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dbCredentials: {
		url: './database.sqlite',
	},
	dialect: 'sqlite',
	schema: './src/database/scheme.ts',
	out: './drizzle',
});
