function showTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    };
    document.getElementById('currentTime').innerHTML = now.toLocaleTimeString('en-US', options);
}

showTime();
setInterval(showTime, 1000);