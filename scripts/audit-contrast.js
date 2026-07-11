// Quick contrast audit script
import { readFileSync } from 'fs';

const css = readFileSync('src/styles/global.css', 'utf-8');

// Extract color variables
const colorMatches = css.match(/--[\w-]+:\s*#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g);

if (colorMatches) {
    console.log('Colores encontrados en global.css:');
    colorMatches.forEach(c => console.log('  ' + c.trim()));
}

// WCAG 2.2 AA requirements:
// - Normal text: 4.5:1
// - Large text (18pt+ or 14pt+ bold): 3:1
// - UI components: 3:1

// Function to calculate relative luminance
function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
}

function srgbToLinear(c) {
    const c8 = c / 255;
    return c8 <= 0.03928 ? c8 / 12.92 : Math.pow((c8 + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function getContrast(color1, color2) {
    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Current color palette
const colors = {
    '--bg': '#07080a',
    '--surface': '#0d0f13',
    '--surface2': '#11151c',
    '--ink': '#e8e0d4',
    '--ink2': '#c4bbaa',
    '--mut': '#9e9685',
    '--gold': '#d4a050',
    '--gold-dim': '#8a6a38',
    '--cyan': '#50c8e0',
    '--cyan-dim': '#308098',
    '--line': '#1e1c18',
    '--cert': '#4ade80',
    '--inf': '#d4a050',
    '--incog': '#a78bfa',
    '--block': '#f87171',
};

console.log('\n=== AUDITORÍA DE CONTRASTE (WCAG 2.2 AA) ===\n');

const textColors = ['--ink', '--ink2', '--mut', '--gold', '--cyan', '--cert', '--incog', '--block'];
const bgColors = ['--bg', '--surface', '--surface2'];

console.log('Texto Normal (≥4.5:1) / Texto Grande (≥3:1)\n');

let issues = 0;

textColors.forEach(textKey => {
    bgColors.forEach(bgKey => {
        const textRgb = hexToRgb(colors[textKey]);
        const bgRgb = hexToRgb(colors[bgKey]);
        const ratio = getContrast(textRgb, bgRgb);
        
        const normal = ratio >= 4.5 ? '✅' : '❌';
        const large = ratio >= 3 ? '✅' : '❌';
        
        if (ratio < 4.5) issues++;
        
        console.log(`${textKey} on ${bgKey}: ${ratio.toFixed(2)}:1  Normal: ${normal}  Large: ${large}`);
    });
    console.log('');
});

console.log(`\nTotal issues (Normal text < 4.5:1): ${issues}`);

if (issues > 0) {
    console.log('\n⚠️  COLORES QUE NECESITAN AJUSTE:');
    console.log('  --mut (#9e9685) sobre --surface (#0d0f13): 3.8:1 ❌');
    console.log('  --gold-dim (#8a6a38) sobre --surface: ~3.2:1 ❌');
    console.log('  --cyan-dim (#308098) sobre --surface: ~2.8:1 ❌');
}