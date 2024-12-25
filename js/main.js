let config = null;

async function loadConfig() {
    try {
        const response = await fetch('config/config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

function initializePage() {
    try {
        setRandomBackground();
        initializeTabs();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

function setRandomBackground() {
    if (!config.backgrounds || config.backgrounds.length === 0) {
        console.error('No backgrounds configured');
        return;
    }
    const randomBg = config.backgrounds[Math.floor(Math.random() * config.backgrounds.length)];
    document.body.style.backgroundImage = `url('images/backgrounds/${randomBg}')`;
}

function initializeTabs() {
    if (!config.tabs || config.tabs.length === 0) {
        console.error('No tabs configured');
        return;
    }

    const tabsContainer = document.getElementById('tabs');
    const tabContentContainer = document.getElementById('tab-content');
    
    // Clear existing content
    tabsContainer.innerHTML = '';
    tabContentContainer.innerHTML = '';
    
    // Create tabs
    config.tabs.forEach((tab, index) => {
        // Create tab element
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${index === 0 ? 'active' : ''}`;
        tabElement.textContent = tab.name;
        tabElement.onclick = () => switchTab(index);
        tabsContainer.appendChild(tabElement);

        // Create tab content container
        const tabContent = document.createElement('div');
        tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
        tabContent.id = `tab-${index}`;

        // Create links grid
        if (tab.links && tab.links.length > 0) {
            const linksGrid = document.createElement('div');
            linksGrid.className = 'links-grid';
            
            tab.links.forEach(link => {
                const linkCard = createLinkCard(link);
                linksGrid.appendChild(linkCard);
            });
            
            tabContent.appendChild(linksGrid);
        } else {
            tabContent.innerHTML = '<div class="no-links">No links available</div>';
        }

        tabContentContainer.appendChild(tabContent);
    });

    // Debug log
    console.log('Tabs container:', tabsContainer.innerHTML);
    console.log('Tab content container:', tabContentContainer.innerHTML);
}

function createLinkCard(link) {
    // Create the card container
    const card = document.createElement('a');
    card.className = 'link-card';
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    // Create the icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';

    // Create and setup the icon
    const icon = document.createElement('img');
    icon.className = 'link-icon';
    icon.alt = link.name;
    icon.width = 32;
    icon.height = 32;

    // Default home icon (material design home icon in white)
    const defaultIcon = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="white">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
    `)}`;

    // Set default icon first
    icon.src = defaultIcon;

    // Try to load the specified favicon
    if (link.favicon) {
        const tempImg = new Image();
        tempImg.onload = () => {
            icon.src = link.favicon;
        };
        tempImg.onerror = () => {
            console.warn(`Failed to load favicon for ${link.name}, using fallback`);
            tryFallbackIcon(icon, link, defaultIcon);
        };
        tempImg.src = link.favicon;
    } else {
        tryFallbackIcon(icon, link, defaultIcon);
    }

    // Create the name element
    const name = document.createElement('span');
    name.className = 'link-name';
    name.textContent = link.name;

    // Assemble the card
    iconContainer.appendChild(icon);
    card.appendChild(iconContainer);
    card.appendChild(name);

    return card;
}

function tryFallbackIcon(icon, link, defaultIcon) {
    try {
        const url = new URL(link.url);
        const domain = url.hostname;
        icon.src = `https://icon.horse/icon/${domain}`;
        
        icon.onerror = () => {
            icon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            icon.onerror = () => {
                icon.src = defaultIcon;
            };
        };
    } catch (error) {
        console.warn(`Invalid URL for ${link.name}:`, error);
        icon.src = defaultIcon;
    }
}

function switchTab(index) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelectorAll('.tab')[index].classList.add('active');
    document.getElementById(`tab-${index}`).classList.add('active');
}

// Initialize the page
loadConfig(); 