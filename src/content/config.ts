import { defineCollection, z } from 'astro:content';

const books = defineCollection({
  type: 'content',
  schema: z.object({
    num: z.string(),
    slug: z.string(),
    title: z.string(),
    genre: z.string(),
    logline: z.string(),
    characters: z.array(z.string()).optional(),
    constants: z.array(z.string()).optional(),
    cover: z.string(),
    wordCount: z.number().optional(),
    chapterCount: z.number().optional(),
    fichaRaw: z.string().optional(),
    status: z.enum(['canon', 'fusión', 'especial']).default('canon'),
    isPublished: z.boolean().default(false),
    publicationBlock: z.string().optional(),
  }),
});

const atlas = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    file: z.string().optional(),
    raw: z.string().optional(),
    status: z.enum(['canon', 'inferido', 'especulativo']).default('canon'),
    needsReview: z.boolean().default(false),
  }),
});

const systems = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    file: z.string().optional(),
    raw: z.string().optional(),
    category: z.enum(['osit', 'moi', 'duat', 'math', 'fcu']).default('osit'),
    status: z.enum(['canon', 'inferido', 'especulativo']).default('canon'),
  }),
});

const cards = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    image: z.string(),
    rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
    faction: z.string().optional(),
    type: z.enum(['character', 'artifact', 'location', 'event', 'ability']).optional(),
    stats: z.record(z.unknown()).optional(),
  }),
});

export const collections = { books, atlas, systems, cards };