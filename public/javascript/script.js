/* 
    Zweck: Frontend-Navigation für die Terminverwaltungs-Webseite
    Nutzergruppe: Alle (öffentlich und Anbieter:innen)
    Funktion: Navigation zwischen Seiten, Authentifizierung, gemeinsame Funktionen
*/

// ===== Gemeinsame Authentifizierungs-Funktionen =====

/**
 * Prüft, ob der Benutzer authentifiziert ist
 * @returns {Promise<boolean>} - true wenn eingeloggt, sonst false
 */
async function getUserIsAuthenticated() {
    try {
        const resp = await fetch("/api/private/ping");
        return resp.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Gibt den Benutzernamen zurück, falls eingeloggt
 * @returns {Promise<string|null>} - Benutzername oder null
 */
async function getUsername() {
    try {
        const resp = await fetch("/api/private/username");
        if (resp.ok) return (await resp.json()).username;
        else return null;
    } catch (error) {
        return null;
    }
}

/**
 * Meldet den Benutzer ab
 * Sendet Logout-Request an Backend und lädt die Seite neu
 * Ursprüngliches Verhalten: window.location.reload() - beibehalten für Konsistenz
 */
async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        // Ursprüngliches Verhalten: Seite neu laden (wie vorher)
        window.location.reload();
    } catch (error) {
        console.error("Logout-Fehler:", error);
        // Bei Fehler trotzdem neu laden
        window.location.reload();
    }
}

// ===== Navigation & Seitenwechsel =====

/**
 * Initialisiert die Navigation beim Laden der Seite
 * Setzt aktive Navigation-Links basierend auf der aktuellen Seite
 */
function initNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Prüfe, ob der Link zur aktuellen Seite führt
        const linkHref = link.getAttribute('href');
        if (linkHref) {
            const linkPath = linkHref.split('?')[0]; // Entferne Query-Parameter
            const currentPage = currentPath.split('?')[0];
            
            if (linkPath === currentPage || 
                (currentPage.includes('index.html') && linkPath.includes('index.html')) ||
                (currentPage.endsWith('/') && linkPath.includes('index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

/**
 * Passt die Navigation basierend auf den Login-Status an
 * Zeigt/versteckt Login-spezifische Navigationselemente
 */
async function initAuthNavigation() {
    const isAuthenticated = await getUserIsAuthenticated();
    
    // Elemente für eingeloggte Benutzer
    const buttonCreate = document.getElementById('button-create');
    const buttonLogout = document.getElementById('button-logout');
    const buttonLogin = document.getElementById('button-login');
    const buttonDashboard = document.getElementById('button-dashboard');
    
    if (isAuthenticated) {
        // Benutzer ist eingeloggt
        if (buttonCreate) buttonCreate.style.display = 'list-item';
        if (buttonDashboard) buttonDashboard.style.display = 'list-item';
        if (buttonLogout) {
            buttonLogout.style.display = 'list-item';
            // Event Listener für Logout hinzufügen
            const logoutLink = buttonLogout.querySelector('a');
            if (logoutLink && !logoutLink.hasAttribute('data-logout-bound')) {
                logoutLink.setAttribute('data-logout-bound', 'true');
                logoutLink.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await logout();
                });
            }
        }
        if (buttonLogin) buttonLogin.style.display = 'none';
    } else {
        // Benutzer ist nicht eingeloggt
        if (buttonCreate) buttonCreate.style.display = 'none';
        if (buttonDashboard) buttonDashboard.style.display = 'none';
        if (buttonLogout) buttonLogout.style.display = 'none';
        if (buttonLogin) buttonLogin.style.display = 'list-item';
    }
}

// ===== Event Listeners =====

// Initialisiere Navigation beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    await initAuthNavigation();
});

