async function updateQuote() {
    const config = await fetch('config/config.json').then(res => res.json());
    const { quotes } = config;
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    document.getElementById('quote-text').textContent = randomQuote.text;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
}

// Update quote every hour
setInterval(updateQuote, 60 * 60 * 1000);
updateQuote(); 