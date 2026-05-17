const fs = require('fs').promises;
const path = require('path');
const generateThumbnail = require('./genThumb.util');

/**
 * Extracts Title and JSON Metadata from a Snapmatic binary buffer
 * @param {Buffer} data
 */
function extractPgtaData(data) {
    let title = "Unknown";
    let jsonObj = {};

    // 1. Find and Extract TITLE
    const titleIdx = data.indexOf(Buffer.from('TITL'));
    if (titleIdx !== -1) {
        const start = titleIdx + 8;
        const end = data.indexOf(0x00, start); // Find null terminator
        if (end !== -1) {
            title = data.toString('utf8', start, end).replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
        }
    }

    // 2. Find and Extract JSON Metadata
    const jsonIdx = data.indexOf(Buffer.from('{"loc"'));
    if (jsonIdx !== -1) {
        const end = data.indexOf(0x00, jsonIdx); // Find null terminator
        if (end !== -1) {
            const jsonString = data.toString('utf8', jsonIdx, end);
            try {
                jsonObj = JSON.parse(jsonString);
            } catch (err) {
                // Ignore JSON parse errors from malformed files
            }
        }
    }

    return { title, jsonObj };
}

function getJsonFields(jsonObj, fieldName, altValue = 'none') {
    return jsonObj && jsonObj[fieldName] ? jsonObj[fieldName] : altValue;
}

const pad = (num) => String(num).padStart(2, '0');

/**
 * Main Worker Processing Function
 */
async function processSnapmatic(fileBuffer, originalName, owner_id) {
    try {
        // Find JPEG magic bytes (FF D8 FF)
        const jpegStart = fileBuffer.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]));

        const { title, jsonObj } = extractPgtaData(fileBuffer);
        const coords = getJsonFields(jsonObj, 'loc');
        const inGameTime = getJsonFields(jsonObj, 'time');
        const realWorldTimeUnixEpoch = getJsonFields(jsonObj, 'creat', Math.floor(Date.now() / 1000));
        const radioStation = getJsonFields(jsonObj, 'rds', 'Radio Off');
        const formattedInGameTime = `${inGameTime.year}-${pad(inGameTime.month)}-${pad(inGameTime.day)} ${pad(inGameTime.hour)}:${pad(inGameTime.minute)}:${pad(inGameTime.second)}`;

        // Convert UNIX Epoch directly to UTC date values
        const realWorldTimeUtc = new Date(realWorldTimeUnixEpoch * 1000);

        if (jpegStart !== -1) {
            // Slice the clean JPEG out of the raw buffer
            const cleanJpgData = fileBuffer.subarray(jpegStart);

            const outDir = path.join(__dirname, '..', 'uploads', 'originals');
            await fs.mkdir(outDir, { recursive: true });

            const photoName = `${owner_id}_${title}_${realWorldTimeUnixEpoch}`

            const outImg = path.join(outDir, `${photoName}.jpg`);

            await fs.writeFile(outImg, cleanJpgData);
            await generateThumbnail(cleanJpgData, photoName)

            return {
                success: true,
                photo_name: `${photoName}.jpg`,
                thumbnail_name: `THUMB${photoName}.webp`,
                title,
                coord_x: coords['x'],
                coord_y: coords['y'],
                coord_z: coords['z'],
                game_time: formattedInGameTime,
                clicked_at: realWorldTimeUtc,
                radio_station: radioStation
            };
        } else {
            return { success: false, filename: originalName, error: "Failed to extract raw JPEG data streams." };
        }
    } catch (err) {
        return { success: false, filename: originalName, error: err.message };
    }
}

module.exports = {processSnapmatic}