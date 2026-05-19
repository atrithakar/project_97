document.addEventListener("DOMContentLoaded", () => {
    const timeElement = document.getElementById("gameTimeDisplay");

    if (timeElement) {
        let gameTime = new Date(timeElement.innerText.trim());
        let userTimezoneOffset = gameTime.getTimezoneOffset();
        gameTime.setMinutes(gameTime.getMinutes() + userTimezoneOffset);
        const cleanedTime = gameTime.toString().split(' GMT')[0];
        timeElement.innerText = cleanedTime;
    }

    document.querySelectorAll('.local-time').forEach(el => {
    const rawTime = el.innerHTML;
    // The browser converts UTC to the user's physical timezone automatically
    el.innerText = new Date(rawTime).toLocaleString(); 
});
});


