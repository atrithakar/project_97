document.addEventListener('DOMContentLoaded', () => {
    const btnFavorite = document.getElementById('btnFavorite');
    if (!btnFavorite) return;

    // 1. Parse photo ID from current URL path
    const urlParts = window.location.pathname.split('/');
    const photoId = urlParts[urlParts.length - 1];

    // 2. Query initial state on load
    fetch(`/api/photos/${photoId}/favourite/status`)
        .then(res => res.json())
        .then(data => updateFavouriteButtonUI(btnFavorite, data.isFavourite))
        .catch(err => console.error("Failed to sync initial favourite state:", err));

    // 3. Handle User Interaction Click Loop
    btnFavorite.addEventListener('click', async () => {
        // Debounce mechanism: lock button to prevent spamming while waiting for DB network I/O
        btnFavorite.style.pointerEvents = 'none';

        try {
            const response = await fetch(`/api/photos/${photoId}/favourite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 401) {
                alert("You must be logged in to add photos to your favourites.");
                window.location.href = '/login'; // Redirect to onboarding
                return;
            }

            const result = await response.json();
            if (result.success) {
                updateFavouriteButtonUI(btnFavorite, result.isFavourite);
            }

        } catch (err) {
            console.error("AJAX favourite execution failed:", err);
        } finally {
            // Unlock button state processing
            btnFavorite.style.pointerEvents = 'auto';
        }
    });
});

/**
 * Mutates the button UI styles to cleanly reflect state based on your desert system variables
 */
function updateFavouriteButtonUI(button, isFavourite) {
    if (isFavourite) {
        button.textContent = 'Favourited';
        button.style.backgroundColor = 'var(--accent-terracotta)';
        button.style.color = 'white';
        button.style.borderColor = 'transparent';
    } else {
        button.textContent = 'Add to Favourites';
        // Reset back to standard unselected state
        button.style.backgroundColor = 'transparent';
        button.style.color = 'var(--accent-terracotta)';
        button.style.borderColor = 'var(--accent-terracotta)';
    }
}