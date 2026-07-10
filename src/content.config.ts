import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum([
      'Teoría de la Información',
      'Herramientas',
      'Agentes',
      'Skills',
      'Observacionismo',
      'Ciencia',
      'Bitácora',
    ]),
    summary: z.string(),
    cover: z.string().optional(),
    estado: z.string().default('INFERENCIA'),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    num: z.string(),
    slug: z.string(),
    title: z.string(),
    genre: z.string().default(''),
    logline: z.string().default(''),
    characters: z.array(z.string()).optional(),
    constants: z.array(z.string()).optional(),
    cover: z.string().default(''),
    wordCount: z.number().optional(),
    chapterCount: z.number().optional(),
    status: z.enum(['canon', 'fusion', 'especial']).default('canon'),
    isPublished: z.boolean().default(false),
    publicationBlock: z.string().optional(),
  }),
});

const atlas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/atlas' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    file: z.string().optional(),
    status: z.enum(['canon', 'inferido', 'especulativo']).default('canon'),
    needsReview: z.boolean().default(false),
  }),
});

const systems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/systems' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    category: z.enum(['osit', 'moi', 'duat', 'math', 'fcu']).default('osit'),
    status: z.enum(['canon', 'inferido', 'especulativo']).default('canon'),
  }),
});

const cards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cards' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    image: z.string().default(''),
    rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
    faction: z.string().optional(),
    type: z.enum(['character', 'artifact', 'location', 'event', 'ability']).optional(),
    stats: z.record(z.unknown()).optional(),
  }),
});

export const collections = { blog, books, atlas, systems, cards };
