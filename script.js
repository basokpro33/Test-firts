// 1. DYNAMIC BUBBLES
function createBubbles() {
    const container = document.getElementById('bubble-container');
    if(!container) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 12; i++) {
        let bubble = document.createElement('div');
        bubble.classList.add('bubble');
        let size = Math.random() * 50 + 20 + 'px';
        bubble.style.width = size; bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.animationDuration = Math.random() * 10 + 12 + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        fragment.appendChild(bubble);
    }
    container.appendChild(fragment);
}
setTimeout(createBubbles, 500);

// 2. HAPTIC & MENU
function triggerHaptic(duration = 40) { if (navigator.vibrate) navigator.vibrate(duration); }
document.addEventListener('click', (e) => { if(e.target.closest('.btn-glass') || e.target.closest('.menu-link') || e.target.closest('.dock-right')) triggerHaptic(50); });

const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
function toggleMobileMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active', menuOpen);
    document.getElementById('hl1').style.transform = menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
    document.getElementById('hl2').style.opacity = menuOpen ? '0' : '1';
    document.getElementById('hl3').style.transform = menuOpen ? 'rotate(-45deg) translate(7px, -8px)' : 'none';
}

// 3. PARALLAX
const meshBg = document.getElementById('meshBg');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0, ticking = false;
function updateParallax() {
    if(window.innerWidth > 800 && meshBg) {
        currentX += (targetX - currentX) * 0.05; currentY += (targetY - currentY) * 0.05;
        meshBg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.05)`;
    }
    ticking = false;
}
window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30; targetY = (e.clientY / window.innerHeight - 0.5) * 30;
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
}, {passive: true});

// ==========================================
// 4. SMART SPA ROUTER (Link Berubah, Tanpa Reload)
// ==========================================
function renderMenu(menuId) {
    // Sembunyikan semua tab
    document.querySelectorAll('.tab-section').forEach(tab => {
        tab.classList.remove('active');
        setTimeout(() => { if(!tab.classList.contains('active')) tab.style.display = 'none'; }, 500); 
    });
    
    // Update Menu Aktif
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${menuId}`) link.classList.add('active');
    });

    // Update Dock Title
    const titles = { 'home': 'Main Portal', 'about-us': 'About Us', 'director': 'Director', 'ecosystem': 'Ecosystem', 'services': 'Services', 'vault': 'The Vault', 'contact': 'Contact' };
    const dockTitle = document.getElementById('dynamic-dock-title');
    if(dockTitle) dockTitle.innerText = titles[menuId] || 'Main Portal';

    // Munculkan Tab Tujuan
    const targetTab = document.getElementById('menu-' + menuId);
    if(targetTab) {
        targetTab.style.display = 'block';
        void targetTab.offsetWidth; // Force Reflow Animasi
        targetTab.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Deteksi jika pengunjung klik back/forward di Browser atau klik link
window.addEventListener('hashchange', () => {
    let hash = window.location.hash.substring(1) || 'home';
    renderMenu(hash);
    if(menuOpen) toggleMobileMenu(); // Tutup menu HP otomatis
});

// Deteksi saat web pertama kali dimuat
window.addEventListener('DOMContentLoaded', () => {
    let hash = window.location.hash.substring(1) || 'home';
    renderMenu(hash);
});

// ==========================================
// 5. LOADING SCREEN (Hanya Jalan 1x Saja)
// ==========================================
const loader = document.getElementById('loading-screen');
if (loader) {
    if (!sessionStorage.getItem('asnf_spa_loaded')) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    sessionStorage.setItem('asnf_spa_loaded', 'true');
                }, 800); 
            }, 1000); // Tampil 1 detik
        });
    } else {
        loader.style.display = 'none'; // Sembunyikan instan jika udah pernah load
    }
}