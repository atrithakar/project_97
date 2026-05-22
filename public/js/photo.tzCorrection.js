document.addEventListener("DOMContentLoaded", () => {
    const timeElement = document.getElementById("gameTimeDisplay");

    if (timeElement) {
        let gameTime = new Date(timeElement.innerText.trim());
        let userTimezoneOffset = gameTime.getTimezoneOffset();
        gameTime.setMinutes(gameTime.getMinutes() + userTimezoneOffset);
        const cleanedTime = gameTime.toString().split(' GMT')[0];
        timeElement.innerText = cleanedTime;
    }

});


