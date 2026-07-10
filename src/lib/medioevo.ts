import { getCollection, type CollectionEntry } from 'astro:content';

export type Book = CollectionEntry<'books'>;
export type AtlasDoc = CollectionEntry<'atlas'>;
export type SystemDoc = CollectionEntry<'systems'>;
export type CardDoc = CollectionEntry<'cards'>;

export type SearchEntry = {
  bookNum: string;
  bookTitle: string;
  chIdx: number;
  chTitle: string;
  snippet: string;
  title: string;
};

export type SearchIndex = SearchEntry[];

export async function getBooks(): Promise<Book[]> {
  return getCollection('books');
}

export async function getBook(slug: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find(b => b.data.slug === slug);
}

export async function getAtlasDocs(): Promise<AtlasDoc[]> {
  return getCollection('atlas');
}

export async function getAtlasDoc(slug: string): Promise<AtlasDoc | undefined> {
  const docs = await getAtlasDocs();
  return docs.find(d => d.data.slug === slug);
}

export async function getSystems(): Promise<SystemDoc[]> {
  return getCollection('systems');
}

export async function getCards(): Promise<CardDoc[]> {
  return getCollection('cards');
}

export function normalizeSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export async function getSearchIndex(): Promise<SearchIndex> {
  const books = await getBooks();
  const index: SearchEntry[] = [];
  for (const book of books) {
    index.push({
      bookNum: book.data.num,
      bookTitle: book.data.title,
      chIdx: 0,
      chTitle: 'Portada',
      snippet: book.data.logline,
      title: book.data.title,
    });
  }
  return index;
}

export const EPISTEMIC_META = {
  canon: { label: 'CANON', color: 'var(--canon)', bg: 'oklch(0.45 0.12 142 / 0.15)' },
  inferido: { label: 'INFERIDO', color: 'var(--inferido)', bg: 'oklch(0.55 0.1 45 / 0.15)' },
  especulativo: { label: 'ESPECULATIVO', color: 'var(--especulativo)', bg: 'oklch(0.6 0.15 300 / 0.15)' },
  fusion: { label: 'FUSIÓN', color: 'var(--fusion)', bg: 'oklch(0.65 0.18 30 / 0.15)' },
  especial: { label: 'ESPECIAL', color: 'var(--especial)', bg: 'oklch(0.58 0.14 60 / 0.15)' },
} as const;
