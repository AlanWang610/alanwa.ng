import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    summary: z.string(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    year: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const collections = { essays, projects };
