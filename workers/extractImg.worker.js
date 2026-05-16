const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');

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

/**
 * Main Worker Processing Function
 */
function processSnapmatic(fileBuffer, originalName) {
    try {
        // Find JPEG magic bytes (FF D8 FF)
        const jpegStart = fileBuffer.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]));

        const { title, jsonObj } = extractPgtaData(fileBuffer);
        const coords = getJsonFields(jsonObj, 'loc');
        const inGameTime = getJsonFields(jsonObj, 'time');
        const realWorldTimeUnixEpoch = getJsonFields(jsonObj, 'creat', Math.floor(Date.now() / 1000));
        const radioStation = getJsonFields(jsonObj, 'rds', 'Radio Off');

        // Convert UNIX Epoch directly to UTC date values
        const realWorldTimeUtc = new Date(realWorldTimeUnixEpoch * 1000);
        const formattedRealWorldTime = {
            hour: realWorldTimeUtc.getUTCHours(),
            minute: realWorldTimeUtc.getUTCMinutes(),
            second: realWorldTimeUtc.getUTCSeconds(),
            day: realWorldTimeUtc.getUTCDate(),
            month: realWorldTimeUtc.getUTCMonth() + 1, // JS Months are 0-11
            year: realWorldTimeUtc.getUTCFullYear()
        };

        if (jpegStart !== -1) {
            // Slice the clean JPEG out of the raw buffer
            const cleanJpgData = fileBuffer.subarray(jpegStart);

            // Setup paths inside the /converted directory
            const outDir = path.join(process.cwd(), 'converted', `${title}_${realWorldTimeUnixEpoch}`);
            fs.mkdirSync(outDir, { recursive: true });

            const outImg = path.join(outDir, 'image.jpg');
            const outInfo = path.join(outDir, 'info.txt');

            // Synchronous block writes are totally safe here because they happen inside an isolated thread
            fs.writeFileSync(outImg, cleanJpgData);
            
            const infoText = `TITLE: ${title}\nLOCATION: ${JSON.stringify(coords)}\nIN GAME TIME: ${JSON.stringify(inGameTime)}\nREAL WORLD TIME: ${JSON.stringify(formattedRealWorldTime)}\nRADIO STATION: ${radioStation}\n`;
            fs.writeFileSync(outInfo, infoText, 'utf8');

            return {
                success: true,
                filename: originalName,
                title,
                coords,
                inGameTime,
                realWorldTime: formattedRealWorldTime,
                radioStation,
                savedPath: outDir
            };
        } else {
            return { success: false, filename: originalName, error: "Failed to extract raw JPEG data streams." };
        }
    } catch (err) {
        return { success: false, filename: originalName, error: err.message };
    }
}

// Thread Execution Entry Point
// Expects an array containing a single file object: [{ buffer: Uint8Array, originalname: string }]
const { file } = workerData;

// Reconstruct standard Buffer from the serialized structured clone data array
const fileBuffer = Buffer.from(file.buffer);

const result = processSnapmatic(fileBuffer, file.originalname);

// Send the parsed data objects back to the main thread controller
parentPort.postMessage(result);