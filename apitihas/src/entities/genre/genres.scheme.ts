import { z } from 'zod';

export const genreInsertSchema = z.object({
	name: z.string(),
});
