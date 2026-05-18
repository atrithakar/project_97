// public/js/feed.js
let currentPage = 1;
const limit = window.innerWidth < 768 ? 15 : 40; // Responsive limits
let isLoading = false;
let hasMore = true;

let sessionSeed = Math.floor(Math.random() * 1000000);

// Target your specific container
const feedContainer = document.querySelector('.feed-container');

// Grab all your UI inputs
const searchInput = document.querySelector('.nav-input');
const timeSelect = document.querySelector('select[title="Filter by Time"]');
const radioSelect = document.querySelector('select[title="Filter by Radio"]');
const mapX = document.getElementById('map_x');
const mapY = document.getElementById('map_y');
const mapRadius = document.getElementById('map_radius');
// const applyMapBtn = document.getElementById('applyMapFilter');

// NOTE: You still need to add <div id="loading-anchor">Loading...</div> directly below your <main> tag in the HTML!
const anchor = document.getElementById('loading-anchor');

function applyFilters() {
    // 1. Reset the pagination clock
    currentPage = 1;
    hasMore = true;

    // 2. Scramble the seed for a fresh random slice of the filtered data
    sessionSeed = Math.floor(Math.random() * 1000000);

    // 3. Clear the DOM entirely
    feedContainer.innerHTML = '';

    // 4. Bring the loading anchor back to life
    anchor.style.display = 'flex';
    anchor.innerHTML = "<p>Loading more...</p>";

    // 5. Fire the network request
    fetchPhotos();
}

async function fetchPhotos() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        // Build the base payload
        const params = new URLSearchParams({
            page: currentPage,
            limit: limit,
            seed: sessionSeed
        });

        // Conditionally attach filters ONLY if they have a value
        if (searchInput.value.trim()) params.append('search', searchInput.value.trim()); 
        if (timeSelect.value) params.append('time', timeSelect.value);
        if (radioSelect.value) params.append('radio', radioSelect.value);
        
        if (mapX.value && mapY.value && mapRadius.value) {
            params.append('map_x', mapX.value);
            params.append('map_y', mapY.value);
            params.append('map_radius', mapRadius.value);
        }

        // Fire the clean, perfectly formatted URL
        const res = await fetch(`/api/photos/feed?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
            hasMore = json.hasMore;

            // Empty Database Guard
            if (json.data.length === 0 && currentPage === 1) {
                feedContainer.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <h3>No photos found!</h3>
                        <p>Try adjusting your filters or search area.</p>
                    </div>`;
                anchor.style.display = 'none';
                return;
            }

            // Build and insert HTML
            const htmlChunks = json.data.map(photo => `
                <div class="pgta-card">
                    <img src="/uploads/thumbnails/${photo.thumbnail_name}" alt="${photo.title}" loading="lazy">
                    <div class="card-meta">
                        <span class="meta-user">${photo.username}</span>
                        <span class="meta-loc">${photo.title}</span>
                    </div>
                </div>
            `).join('');

            feedContainer.insertAdjacentHTML('beforeend', htmlChunks);
            currentPage++;
        }
    } catch (err) {
        console.error("Failed to fetch feed:", err);
    } finally {
        isLoading = false;
        if (!hasMore) {
            if (currentPage <= 2 && feedContainer.children.length < 10) {
                anchor.style.display = 'none';
            } else {
                anchor.innerHTML = "End of Gallery.";
            }
        }
    }
}

// IntersectionObserver setup
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        fetchPhotos();
    }
}, { rootMargin: "200px" }); // Triggers slightly before they hit the bottom


// Debounce for text search
let searchTimeout = null;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 200);
});

// Instant triggers for dropdowns
timeSelect.addEventListener('change', applyFilters);
radioSelect.addEventListener('change', applyFilters);

// Trigger for the Map modal
applyMapBtn.addEventListener('click', () => {
    applyFilters();
    document.getElementById('mapModal').close(); 
});

// Start the engine
if (anchor) {
    observer.observe(anchor);
} else {
    console.error("CRITICAL: You forgot to put the <div id='loading-anchor'> at the bottom of your HTML!");
}