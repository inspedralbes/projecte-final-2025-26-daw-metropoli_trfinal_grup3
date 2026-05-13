document.addEventListener('DOMContentLoaded', () => {
    const WEB_URL = 'https://catcircuit.cat/';
    
    const goToWebBtn = document.getElementById('goToWeb');
    const openMapBtn = document.getElementById('openMap');
    const navItems = document.querySelectorAll('.nav-item');

    // Helper to open URLs
    const openRoute = (route = '') => {
        const url = `${WEB_URL}${route}`;
        window.open(url, '_blank');
    };

    // Generic "Go to Web" button (Home)
    goToWebBtn.addEventListener('click', () => openRoute(''));

    // Map Preview Card
    openMapBtn.addEventListener('click', () => openRoute('map'));

    // Quick Access Grid Items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const route = item.getAttribute('data-route');
            if (route) {
                openRoute(route);
            }
        });
    });

    // Subtle log to confirm initialization
    console.log('WeMap Extension Initialized');
});

