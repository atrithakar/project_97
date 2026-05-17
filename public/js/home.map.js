// 1. Grab all the DOM elements
const mapModal = document.getElementById('mapModal');
const openMapBtn = document.getElementById('openMapFilter');
const closeMapBtn = document.getElementById('closeMap');
const applyMapBtn = document.getElementById('applyMapFilter');

const radiusSlider = document.getElementById('radiusSlider');
const radiusOutput = document.getElementById('radiusOutput');

const inputX = document.getElementById('map_x');
const inputY = document.getElementById('map_y');
const inputRadius = document.getElementById('map_radius');

let map = null;
let activeMarker = null;
let activeCircle = null;

let currentRadius = parseInt(radiusSlider.value);

// ==========================================
// THE TRANSLATION ENGINE (YOUR 1.6425 GOES HERE)
// ==========================================
let currentGameX = 0; // Sent to Database
let currentGameY = 0; // Sent to Database
let renderX = 0;      // Drawn on Screen
let renderY = 0;      // Drawn on Screen

// const GAME_SCALE_FACTOR = 1.6425;
const GAME_SCALE_FACTOR = 1.51;

// LEAVE THESE AT 0 FOR NOW. Follow my previous instructions 
// to click the center of the map and find your true offsets.
const OFFSET_X = -2474;
const OFFSET_Y = 5270;
// ==========================================

// 2. Open Modal & Initialize Map
openMapBtn.addEventListener('click', () => {
    mapModal.showModal();

    setTimeout(() => {
        if (!map) {
            // TILE SERVER MATH: DO NOT TOUCH THIS 1/32
            const scaleFactor = 1 / 32;
            L.CRS.GTA = L.extend({}, L.CRS.Simple, {
                transformation: new L.Transformation(scaleFactor, 0, -scaleFactor, 0)
            });

            // Initialize the map
            map = L.map('filterMap', {
                crs: L.CRS.GTA,
                minZoom: 0,
                maxZoom: 5,
                zoomControl: true
            });

            const bounds = [[0, 0], [-8192, 8192]];

            L.tileLayer('/maps/gtav/{z}/{x}/{y}.png', {
                minZoom: 0,
                maxZoom: 5,
                noWrap: true,
                bounds: bounds,
                tms: false
            }).addTo(map);

            map.fitBounds(bounds);

            // Handle map clicks (TRANSLATION HAPPENS HERE)
            map.on('click', (e) => {
                // 1. Get raw screen pixels for rendering
                renderX = e.latlng.lng;
                renderY = e.latlng.lat;

                // 2. Translate to Rockstar Game Units for the database
                currentGameX = (renderX + OFFSET_X) * GAME_SCALE_FACTOR;
                currentGameY = (renderY + OFFSET_Y) * GAME_SCALE_FACTOR;

                console.log(`Pixels: [${renderX.toFixed(0)}, ${renderY.toFixed(0)}] -> Game DB: [${currentGameX.toFixed(0)}, ${currentGameY.toFixed(0)}]`);

                updateMapVisuals();
            });
        } else {
            map.invalidateSize();
        }
    }, 0);
});

// 3. Handle Slider Adjustments
radiusSlider.addEventListener('input', (e) => {
    currentRadius = parseInt(e.target.value);
    radiusOutput.textContent = currentRadius;

    if (activeMarker) updateMapVisuals();
});

// 4. Draw the Pin and Radius Circle
function updateMapVisuals() {
    if (activeMarker) map.removeLayer(activeMarker);
    if (activeCircle) map.removeLayer(activeCircle);

    // DRAW USING RENDER PIXELS
    activeMarker = L.marker([renderY, renderX]).addTo(map);

    activeCircle = L.circle([renderY, renderX], {
        // DIVIDE BY SCALE SO THE UI CIRCLE MATCHES IN-GAME METERS
        radius: currentRadius / GAME_SCALE_FACTOR,
        color: '#c87965',
        fillColor: '#c87965',
        fillOpacity: 0.2
    }).addTo(map);
}

// 5. Apply the Filter and Close
applyMapBtn.addEventListener('click', () => {
    if (!activeMarker) {
        alert("Please click on the map to select a region.");
        return;
    }

    // INJECT GAME COORDINATES INTO HIDDEN FORM INPUTS
    inputX.value = currentGameX;
    inputY.value = currentGameY;
    inputRadius.value = currentRadius;

    openMapBtn.textContent = `📍 Region: Selected (${currentRadius}m)`;
    openMapBtn.classList.add('btn-primary');
    openMapBtn.classList.remove('btn-ghost');

    mapModal.close();
});

// 6. Close Map without applying
closeMapBtn.addEventListener('click', () => {
    mapModal.close();
});