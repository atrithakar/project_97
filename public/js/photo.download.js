document.addEventListener('DOMContentLoaded', () => {
    const btnDownload = document.getElementById('btnDownload');

    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            // 1. Grab the unique photo ID directly out of your current browser URL path
            // e.g., /view/photo/f23a3835-96d0-4fe1-a4c7-973ea74ecf4f
            const urlParts = window.location.pathname.split('/');
            const photoId = urlParts[urlParts.length - 1];

            if (photoId) {
                // 2. Redirect the window directly to your download endpoint
                // Because the backend sets Content-Disposition: attachment, 
                // the current page WILL NOT change or refresh. The download dialog just pops over it.
                window.location.href = `/api/photos/download/${photoId}`;
            } else {
                console.error("Failed to parse photo ID from application path.");
            }
        });
    }
});