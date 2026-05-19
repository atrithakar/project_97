document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const feedContainer = document.getElementById('profileFeedContainer');
    
    // Process local time attributes immediately on load
    document.querySelectorAll('.local-time').forEach(el => {
        const rawUtc = el.getAttribute('data-utc');
        if (rawUtc) {
            el.innerText = new Date(rawUtc).toLocaleDateString();
        }
    });

    if (tabButtons.length === 0 || !feedContainer) return;

    // Extract target username from the URL
    const urlParts = window.location.pathname.split('/');
    const targetUsername = urlParts[urlParts.length - 1];

    // Boot cycle: load uploads by default
    loadTabFeed('uploads', targetUsername, feedContainer);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            // Toggle UI state
            document.querySelector('.tab-btn.active').classList.remove('active');
            button.classList.add('active');

            // Trigger fetch
            const activeTab = button.dataset.tab;
            loadTabFeed(activeTab, targetUsername, feedContainer);
        });
    });
});

async function loadTabFeed(tabType, username, container) {
    container.innerHTML = '<div class="feed-spinner">Synchronizing feed...</div>';

    try {
        const response = await fetch(`/api/users/${username}/${tabType}`);
        if (!response.ok) throw new Error("Network returned execution error.");
        
        const data = await response.json();
        
        if (!data.photos || data.photos.length === 0) {
            container.innerHTML = `
                <div class="feed-spinner" style="color: #999;">
                    No snapmatics indexed in this sub-section yet.
                </div>`;
            return;
        }

        container.innerHTML = '';
        
        data.photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'pgta-card';
            
            card.addEventListener('click', () => {
                window.location.href = `/view/photo/${photo.id}`;
            });

            // Adjust path based on your static folder configuration
            card.innerHTML = `
                <img src="/uploads/thumbnails/${photo.thumbnail_name}" alt="${photo.title}">
                <div class="card-meta">
                    <span class="meta-user">@${photo.username}</span>
                    <span class="meta-loc">${photo.title}</span>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Hydration loop aborted:", err);
        container.innerHTML = '<div class="feed-spinner">Failed to render captures.</div>';
    }
}