// Grab the button and the menu
const toggleBtn = document.querySelector('.mobile-toggle');
const navControls = document.querySelector('.nav-controls');

// Listen for clicks on the hamburger icon
toggleBtn.addEventListener('click', () => {
    // Add or remove the 'active' class to show/hide the menu
    navControls.classList.toggle('active');
});