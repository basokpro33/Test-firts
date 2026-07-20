// ==========================================
// SHINKO ENGINE 15.2 - LOGIC & UTILS (MPA)
// ==========================================

// 1. DYNAMIC BUBBLE GENERATOR
function createBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;
    const bubbleCount = 12;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < bubbleCount; i++) {
        let bubble = document.createElement('div');
        bubble.classList.add('bubble');
        let size = Math.random() * 50 + 20 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.animationDuration = Math.random() * 10 + 12 + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        fragment.appendChild(bubble);
    }
    container.appendChild(fragment);
}
setTimeout(createBubbles, 500);

// 2. ASNF HAPTIC ENGINE
function triggerHaptic(duration = 40) {
    if (navigator.vibrate) { navigator.vibrate(duration); }
}
document.addEventListener('click', (e) => {
    if(e.target.closest('.btn-glass') || e.target.closest('.menu-link') || e.target.closest('.dock-right')) {
        triggerHaptic(50);
    }
});

// 3. HAMBURGER MENU LOGIC
const mobileMenu = document.getElementById('mobileMenu');
const hl1 = document.getElementById('hl1');
const hl2 = document.getElementById('hl2');
const hl3 = document.getElementById('hl3');
let menuOpen = false;

function toggleMobileMenu() {
    menuOpen = !menuOpen;
    if(menuOpen) {
        mobileMenu.classList.add('active');
        hl1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        hl2.style.opacity = '0';
        hl3.style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
        mobileMenu.classList.remove('active');
        hl1.style.transform = 'none';
        hl2.style.opacity = '1';
        hl3.style.transform = 'none';
    }
}

// 4. LERP PARALLAX
const meshBg = document.getElementById('meshBg');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
const lerpFactor = 0.05;
let ticking = false;

function updateParallax() {
    if(window.innerWidth > 800 && meshBg) {
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;
        meshBg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.05)`;
    }
    ticking = false;
}

window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30; 
    targetY = (e.clientY / window.innerHeight - 0.5) * 30;
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, {passive: true});

window.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; requestAnimationFrame(updateParallax); });

// 5. ACTIVE MENU DETECTOR & BOOT LOGIC
window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set Active State on Menu
    document.querySelectorAll('.menu-link').forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Set Dynamic Title on Dock
    const dockTitle = document.getElementById('dynamic-dock-title');
    if (dockTitle) {
        const titleMap = {
            'index.html': 'Main Portal',
            'about-us.html': 'About Us',
            'board-of-director.html': 'Director',
            'flagship-ecosystem.html': 'Ecosystem',
            'service-and-studio.html': 'Services',
            'the-vault.html': 'The Vault',
            'contact-and-support.html': 'Contact'
        };
        dockTitle.innerText = titleMap[currentPath] || 'Main Portal';
    }
});

// 6. SMART LOADING SCREEN (Hanya muncul 1 kali per sesi browser)
const loader = document.getElementById('loading-screen');
if (loader) {
    // Cek apakah pengunjung sudah pernah loading
    if (!sessionStorage.getItem('isAppLoaded')) {
        // Jika belum, jalankan animasi loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Simpan memori bahwa user sudah melewati loading
                    sessionStorage.setItem('isAppLoaded', 'true');
                }, 800); 
            }, 500); 
        });
    } else {
        // Jika sudah pernah loading, langsung sembunyikan (tanpa animasi)
        loader.style.display = 'none';
    }
}
