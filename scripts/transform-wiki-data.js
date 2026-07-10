#!/usr/bin/env node
/**
 * Transform wiki JSON data to Astro Content Collections (Markdown + frontmatter)
 * Input: C:\Temp\zip_inspect\wiki\public\data\*.json
 * Output: C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-\apps\medioevo-site-v2\src\content\wiki\
 */

import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'C:/Temp/zip_inspect/wiki/public/data';
const OUTPUT_BASE = 'C:/Users/L-Tyr/OneDrive/Escritorio/-= BRAIN_OS =-/apps/medioevo-site-v2/src/content/wiki';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeFrontmatter(str) {
  return str
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// --- BOOKS ---
function transformBooks() {
  const booksData = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, 'books.json'), 'utf-8'));
  
  for (const book of booksData) {
    const frontmatter = {
      num: book.num,
      slug: book.slug,
      title: book.title,
      genre: book.genre,
      logline: book.logline,
      characters: book.characters || [],
      constants: book.constants || [],
      cover: book.cover,
      wordCount: book.wordCount || 0,
      chapterCount: book.chapterCount || 0,
      status: book.num.startsWith('F') ? 'especial' : 'canon',
      isPublished: false,
      publicationBlock: book.fichaRaw?.includes('BLOQUEADO') ? 'protagonistas reales' : undefined,
    };
    
    const fmStr = Object.entries(frontmatter)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: [${v.map(x => `"${escapeFrontmatter(x)}"`).join(', ')}]`;
        if (typeof v === 'string') return `${k}: "${escapeFrontmatter(v)}"`;
        return `${k}: ${v}`;
      }).join('\n');
    
    const content = book.fichaRaw ? `\n---\n\n${book.fichaRaw}` : '';
    
    const md = `---\n${fmStr}\n---\n${content}`;
    
    const outPath = path.join(OUTPUT_BASE, 'books', `${book.num.toLowerCase().replace('f', 'f')}.md`);
    fs.writeFileSync(outPath, md);
    console.log(`✅ Book: ${book.num} → ${path.basename(outPath)}`);
  }
  
  console.log(`Total books: ${booksData.length}`);
}

// --- ATLAS ---
function transformAtlas() {
  const atlasData = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, 'atlas-docs.json'), 'utf-8'));
  
  for (const doc of atlasData) {
    const frontmatter = {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      file: doc.file,
      status: doc.raw?.includes('[ESPECULATIVO]') ? 'especulativo' : 
              doc.raw?.includes('[INFERIDO]') ? 'inferido' : 'canon',
      needsReview: doc.raw?.includes('??') || doc.raw?.includes('<PENDIENTE') || false,
    };
    
    const fmStr = Object.entries(frontmatter)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => {
        if (typeof v === 'string') return `${k}: "${escapeFrontmatter(v)}"`;
        if (typeof v === 'boolean') return `${k}: ${v}`;
        return `${k}: ${v}`;
      }).join('\n');
    
    const content = doc.raw ? `\n---\n\n${doc.raw}` : '';
    const md = `---\n${fmStr}\n---\n${content}`;
    
    const outPath = path.join(OUTPUT_BASE, 'atlas', `${doc.slug}.md`);
    fs.writeFileSync(outPath, md);
    console.log(`✅ Atlas: ${doc.id} → ${doc.slug}.md`);
  }
  
  console.log(`Total atlas docs: ${atlasData.length}`);
}

// --- SYSTEMS ---
function transformSystems() {
  // From the 03_EVALUACION_MATEMATICA zip we have system docs
  const systemFiles = {
    'osit-framework': { category: 'osit', title: 'OSIT Framework' },
    'fcu-framework': { category: 'fcu', title: 'FCU Framework' },
    'duat': { category: 'duat', title: 'DUAT System' },
    'moi': { category: 'moi', title: 'MOI Research' },
    'matematicas': { category: 'math', title: 'Matemáticas OSIT' },
  };
  
  for (const [id, meta] of Object.entries(systemFiles)) {
    const frontmatter = {
      id,
      title: meta.title,
      slug: id,
      category: meta.category,
      status: 'canon',
    };
    
    const fmStr = Object.entries(frontmatter)
      .map(([k, v]) => `${k}: "${escapeFrontmatter(v)}"`).join('\n');
    
    const md = `---\n${fmStr}\n---\n`;
    const outPath = path.join(OUTPUT_BASE, 'systems', `${id}.md`);
    fs.writeFileSync(outPath, md);
    console.log(`✅ System: ${id}`);
  }
}

// --- CARDS ---
function transformCards() {
  const cardsDir = 'C:/Temp/zip_inspect/cards/incoming_cards_20260515';
  const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const id = file.replace('.png', '');
    const frontmatter = {
      id,
      name: id,
      slug: id,
      image: `/wiki/cards/${file}`,
      rarity: 'common',
      type: 'artifact',
    };
    
    const fmStr = Object.entries(frontmatter)
      .map(([k, v]) => `${k}: "${escapeFrontmatter(v)}"`).join('\n');
    
    const md = `---\n${fmStr}\n---\n`;
    const outPath = path.join(OUTPUT_BASE, 'cards', `${id}.md`);
    fs.writeFileSync(outPath, md);
  }
  
  console.log(`Total cards: ${files.length}`);
}

// --- RUN ---
console.log('=== Transforming BOOKS ===');
transformBooks();

console.log('\n=== Transforming ATLAS ===');
transformAtlas();

console.log('\n=== Transforming SYSTEMS ===');
transformSystems();

console.log('\n=== Transforming CARDS ===');
transformCards();

console.log('\n✅ All transformations complete!');