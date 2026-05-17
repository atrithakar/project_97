// public/js/feed.js
let currentPage = 1;
const limit = window.innerWidth < 768 ? 15 : 40; // Responsive limits
let isLoading = false;
let hasMore = true;

const sessionSeed = Math.floor(Math.random() * 1000000);

// Target your specific container
const feedContainer = document.querySelector('.feed-container');

// NOTE: You still need to add <div id="loading-anchor">Loading...</div> directly below your <main> tag in the HTML!
const anchor = document.getElementById('loading-anchor');

async function fetchPhotos() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await fetch(`/api/photos/feed?page=${currentPage}&limit=${limit}&seed=${sessionSeed}`);
        const json = await res.json();

        if (json.success) {
            hasMore = json.hasMore;

            // Empty Database Guard
            if (json.data.length === 0 && currentPage === 1) {
                feedContainer.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1; text-align: center;">
                        <h3>No photos yet!</h3>
                        <p>Upload some Snapmatics to get started.</p>
                    </div>`;
                anchor.style.display = 'none';
                return;
            }

            // Build the massive HTML string in memory first (extremely fast)
            const htmlChunks = json.data.map(photo => `
                <div class="pgta-card">
                    <img src="/uploads/thumbnails/${photo.thumbnail_name}" alt="${photo.title}" loading="lazy">
                    <div class="card-meta">
                        <span class="meta-user">${photo.username}</span>
                        <span class="meta-loc">${photo.title}</span>
                    </div>
                </div>
            `).join('');

            // Dump it into the DOM in one single paint operation
            feedContainer.insertAdjacentHTML('beforeend', htmlChunks);

            currentPage++;
        }
    } catch (err) {
        console.error("Failed to fetch feed:", err);
    } finally {
        isLoading = false;

        // Sparse State / End of DB Guard
        if (!hasMore) {
            // If the feed container has very few children, just hide the anchor quietly
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

// Start the engine
if (anchor) {
    observer.observe(anchor);
} else {
    console.error("CRITICAL: You forgot to put the <div id='loading-anchor'> at the bottom of your HTML!");
}