// document.addEventListener('DOMContentLoaded', () => {
//     const mapContainer = document.getElementById('staticMap');
//     if (!mapContainer) return;

//     // 1. Your exact Constants
//     const GAME_SCALE_FACTOR = 1.51;
//     const OFFSET_X = -2474;
//     const OFFSET_Y = 5270;

//     // 2. Extract Game Coordinates injected by EJS
//     const currentGameX = parseFloat(mapContainer.dataset.x);
//     const currentGameY = parseFloat(mapContainer.dataset.y);

//     // 3. REVERSE THE MATH (Game Data -> Screen Pixels)
//     const renderX = (currentGameX / GAME_SCALE_FACTOR) - OFFSET_X;
//     const renderY = (currentGameY / GAME_SCALE_FACTOR) - OFFSET_Y;

//     // 4. Your Custom CRS Engine
//     const scaleFactor = 1 / 32;
//     L.CRS.GTA = L.extend({}, L.CRS.Simple, {
//         transformation: new L.Transformation(scaleFactor, 0, -scaleFactor, 0)
//     });

//     const bounds = [[0, 0], [-8192, 8192]];

//     // 5. Initialize Map with static parameters
//     const map = L.map('staticMap', {
//         crs: L.CRS.GTA,
//         minZoom: 0,
//         maxZoom: 5,
//         zoomControl: false,      // Hide zoom controls for a cleaner UI
//         scrollWheelZoom: false,  // Prevent accidental scrolling
//         doubleClickZoom: false,
//         dragging: false          // Lock the map in place like a photo
//     });

//     // 6. Load your local tiles
//     L.tileLayer('/maps/gtav/{z}/{x}/{y}.png', {
//         minZoom: 0,
//         maxZoom: 5,
//         noWrap: true,
//         bounds: bounds,
//         tms: false
//     }).addTo(map);

//     // 7. Center the map EXACTLY on the calculated pixels
//     map.setView([renderY, renderX], 2); // Adjust '2' to frame the 50m radius perfectly

//     // 8. Draw the Pin and the 50m Radius Ring
//     L.marker([renderY, renderX]).addTo(map);

//     L.circle([renderY, renderX], {
//         radius: 50 / GAME_SCALE_FACTOR, // Must divide by scale so the ring covers 50 in-game meters
//         color: '#ff4d4d',
//         fillColor: '#f03',
//         fillOpacity: 0.2
//     }).addTo(map);
// });


document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('staticMap');
    if (!mapContainer) return;

    const GAME_SCALE_FACTOR = 1.51;
    const OFFSET_X = -2474;
    const OFFSET_Y = 5270;

    const currentGameX = parseFloat(mapContainer.dataset.x);
    const currentGameY = parseFloat(mapContainer.dataset.y);

    const renderX = (currentGameX / GAME_SCALE_FACTOR) - OFFSET_X;
    const renderY = (currentGameY / GAME_SCALE_FACTOR) - OFFSET_Y;

    const scaleFactor = 1 / 32;
    L.CRS.GTA = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(scaleFactor, 0, -scaleFactor, 0)
    });

    const bounds = [[0, 0], [-8192, 8192]];

    // 5. THE UNLOCKED MAP ENGINE
    const map = L.map('staticMap', {
        crs: L.CRS.GTA,
        minZoom: 0,
        maxZoom: 5,
        zoomControl: true,       // UNLOCKED
        scrollWheelZoom: true,   // UNLOCKED
        doubleClickZoom: true,   // UNLOCKED
        dragging: true,          // UNLOCKED
        maxBounds: bounds,       // THE GUARDRAIL: Prevents panning into the void
        maxBoundsViscosity: 0.8  // Makes the edge feel "sticky" when they hit it
    });

    L.tileLayer('/maps/gtav/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        noWrap: true,
        bounds: bounds,
        tms: false
    }).addTo(map);

    // Frame the map perfectly on load
    map.setView([renderY, renderX], 5); 

    // Draw the Pin and Radius
    L.marker([renderY, renderX]).addTo(map);

    L.circle([renderY, renderX], {
        radius: 100 / GAME_SCALE_FACTOR, 
        color: '#ff4d4d',
        fillColor: '#f03',
        fillOpacity: 0.2
    }).addTo(map);
});