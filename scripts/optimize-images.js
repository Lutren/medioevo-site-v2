// Optimize images using Sharp (Node.js)
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import sharp from 'sharp';

const basePath = 'C:/Users/L-Tyr/OneDrive/Escritorio/-= BRAIN_OS =-/apps/medioevo-site-v2/public/wiki/covers';
const webpPath = join(basePath, 'webp');

if (!existsSync(webpPath)) {
    mkdirSync(webpPath, { recursive: true });
    console.log('✅ Carpeta webp creada');
}

const sizes = [400, 800, 1200];
const quality = 85;

const files = readdirSync(basePath).filter(f => f.endsWith('.jpg'));
console.log(`\n🔄 INICIANDO OPTIMIZACIÓN DE ${files.length} IMÁGENES\n`);

let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let successCount = 0;
let failCount = 0;

for (const file of files) {
    const inputPath = join(basePath, file);
    const imageName = basename(file, extname(file));
    const stats = await sharp(inputPath).stats();
    const originalSize = stats.size;
    
    console.log(`[${successCount + failCount + 1}/${files.length}] ${file}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    
    try {
        let srcsetParts = [];
        
        for (const size of sizes) {
            const outputPath = join(webpPath, `${imageName}-${size}.webp`);
            
            await sharp(inputPath)
                .resize(size)
                .webp({ quality })
                .toFile(outputPath);
            
            const outputStats = await sharp(outputPath).stats();
            const optimizedSize = outputStats.size;
            const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(2);
            
            console.log(`  ✓ ${size}w: ${(optimizedSize / 1024).toFixed(2)} KB (-${reduction}%)`);
            
            srcsetParts.push(`/wiki/covers/webp/${imageName}-${size}.webp ${size}w`);
            totalOptimizedSize += optimizedSize;
        }
        
        console.log(`  → srcset: ${srcsetParts.join(', ')}`);
        successCount++;
        totalOriginalSize += originalSize;
        
    } catch (error) {
        console.log(`  ✗ Error: ${error.message}`);
        failCount++;
    }
}

console.log('\n=== RESUMEN ===');
console.log(`✅ Exitosas: ${successCount}/${files.length}`);
console.log(`❌ Fallidas: ${failCount}`);
console.log(`📊 Original: ~${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 Optimizado: ~${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`💾 Ahorro: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(2)}%`);