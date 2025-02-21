const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'images';
const outputDir = 'images/optimized';

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
        sharp(path.join(inputDir, file))
            .resize(800) // Max width
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, `${path.parse(file).name}.webp`))
            .then(() => console.log(`Converted ${file} to WebP`));
            
        sharp(path.join(inputDir, file))
            .resize(800)
            .jpeg({ quality: 80 })
            .toFile(path.join(outputDir, file))
            .then(() => console.log(`Optimized ${file}`));
    }
}); 