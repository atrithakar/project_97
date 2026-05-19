document.addEventListener('DOMContentLoaded', () => {
    const btnCopyCoords = document.getElementById('btnCopyCoords');
    const mapContainer = document.getElementById('staticMap');

    if (btnCopyCoords && mapContainer) {
        btnCopyCoords.addEventListener('click', () => {
            // 1. Extract the raw game coordinates from the map's data attributes
            const x = mapContainer.dataset.x;
            const y = mapContainer.dataset.y;
            const coordString = `[${x}, ${y}]`;

            // 2. Execute the cross-protocol copy engine
            copyToClipboard(coordString, btnCopyCoords);
        });
    }
});

/**
 * Robust copy engine that dynamically fallbacks on unsecure HTTP contexts
 */
function copyToClipboard(text, buttonElement) {
    // Strategy A: Modern Secure Clipboard API (HTTPS & Localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => triggerSuccessUI(buttonElement))
            .catch(err => console.error('Secure copy failed:', err));
    } else {
        // Strategy B: Legacy Invisible Input Fallback (Standard HTTP)
        try {
            // 1. Create an invisible textarea off-screen
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // Prevent scrolling to bottom of page when appending
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';

            document.body.appendChild(textArea);

            // 2. Programmatically highlight the text inside it
            textArea.focus();
            textArea.select();

            // 3. Execute the legacy copy command
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                triggerSuccessUI(buttonElement);
            } else {
                throw new Error('execCommand returned false');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            alert(`Could not auto-copy. Coordinates: ${text}`);
        }
    }
}

/**
 * Premium micro-interaction for user feedback
 */
function triggerSuccessUI(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.pointerEvents = 'none'; // Prevent double-clicks during timeout

    setTimeout(() => {
        button.textContent = originalText;
        button.style.pointerEvents = 'auto';
    }, 2000);
}