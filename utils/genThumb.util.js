const sharp = require("sharp");
const path = require("path")

/**
 * 
 * @param {Buffer} fileBuffer 
 */
async function generateThumbnail(fileBuffer, fileName) {
    await sharp(fileBuffer).webp({quality: 75}).toFile(path.join(__dirname, '..', 'uploads', 'thumbnails', `THUMB${fileName}.webp`))
}

module.exports = generateThumbnail