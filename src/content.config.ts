import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string(),
    recurring: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

const officers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/officers' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number(),
    phone: z.string().optional(),
    photo: z.string().optional(),
  }),
});

export const collections = { events, officers };
