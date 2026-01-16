import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = join(__dirname, '../public/icons');

// SVG with embedded font (more reliable)
const createSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#818cf8"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.21)}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size * 0.68}" 
        font-family="Arial, sans-serif" 
        font-size="${Math.round(size * 0.55)}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">楽</text>
</svg>
`;

async function generateIcons() {
  try {
    await mkdir(iconsDir, { recursive: true });
    
    for (const size of sizes) {
      const svg = createSvg(size);
      const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated: icon-${size}x${size}.png`);
    }
    
    // Also create apple-touch-icon (180x180)
    const appleSvg = createSvg(180);
    await sharp(Buffer.from(appleSvg))
      .resize(180, 180)
      .png()
      .toFile(join(iconsDir, 'apple-touch-icon.png'));
    console.log('✓ Generated: apple-touch-icon.png');
    
    // Create favicon (32x32)
    const faviconSvg = createSvg(32);
    await sharp(Buffer.from(faviconSvg))
      .resize(32, 32)
      .png()
      .toFile(join(iconsDir, 'favicon-32x32.png'));
    console.log('✓ Generated: favicon-32x32.png');
    
    // Create favicon-16x16
    const favicon16Svg = createSvg(16);
    await sharp(Buffer.from(favicon16Svg))
      .resize(16, 16)
      .png()
      .toFile(join(iconsDir, 'favicon-16x16.png'));
    console.log('✓ Generated: favicon-16x16.png');
    
    console.log('\n🎉 All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();





