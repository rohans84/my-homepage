function updateClock() {
    const now = new Date();
    
    // Update time
    const time = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('time').textContent = time;
    
    // Update date
    const date = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('date').textContent = date;
}

setInterval(updateClock, 1000);
updateClock(); 