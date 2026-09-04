const sharp = require("sharp");
const path = require("path")
const fs = require('fs').promises;


/**
 * 
 * @param {Buffer} fileBuffer 
 */
async function generateThumbnail(fileBuffer, fileName) {
    const outDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
    await fs.mkdir(outDir, { recursive: true });

    await sharp(fileBuffer).webp({quality: 75}).toFile(path.join(__dirname, '..', 'uploads', 'thumbnails', `THUMB${fileName}.webp`))
}

module.exports = generateThumbnail