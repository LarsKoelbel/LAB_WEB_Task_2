/* 
    Zweck: JavaScript für die Registrierungs-Seite
    Nutzergruppe: Anbieter:innen
    Funktion: Behandelt Registrierungs-Formular, Weiterleitung zum Login
    Backend-Integration: Wird später durch API-Call ersetzt (POST /api/auth/register)
*/

/**
 * Initialisiert die Registrierungs-Seite
 */
function initRegistrierung() {
    document.getElementById('registrierung-form').addEventListener('submit', (event) => {
        event.preventDefault();
        register();
    });
}

/**
 * Register a user
 */
async function register()
{
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const password_confirm = document.getElementById('reg-password-confirm').value;
    const response = document.getElementById('response');

    // Verstecke vorherige Fehlermeldungen
    response.style.display = 'none';
    response.classList.remove('error', 'success');

    // Prüfe Passwort-Übereinstimmung
    if (password !== password_confirm) {
        response.textContent = "Die Passwörter stimmen nicht überein. Bitte wiederholen Sie das Passwort korrekt.";
        response.classList.add('error');
        response.style.display = 'block';
        return;
    }

    try {
        const result = await fetch("/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        if (!result.ok) {
            const errorData = await result.json();
            response.textContent = errorData.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
            response.classList.add('error');
            response.style.display = 'block';
        }
        else {
            // Erfolgreiche Registrierung - Weiterleitung zum Login
            window.location.href = "/login.html";
        }
    }catch(err) {
        response.textContent = err.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
        response.classList.add('error');
        response.style.display = 'block';
    }

}

// Initialisiere Seite beim Laden
window.addEventListener('load', initRegistrierung);

