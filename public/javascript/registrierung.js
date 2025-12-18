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

    if (password !== password_confirm) {response.textContent = "Passwords do not match"; return;}

    try {
        const result = await fetch("/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        if (!result.ok) {
            console.log(result);
            response.textContent = (await result.json()).message;
        }
        else {
            // Return to login page in successful login
            window.location.href = "/login.html";
        }
    }catch(err) {
        response.textContent = err.message;
    }

}

// Initialisiere Seite beim Laden
window.addEventListener('load', initRegistrierung);

