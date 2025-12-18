/* 
    Zweck: JavaScript für die Login-Seite
    Nutzergruppe: Anbieter:innen
    Funktion: Behandelt Login-Formular, Weiterleitung zum Dashboard
    Backend-Integration: Wird später durch API-Call ersetzt (POST /api/auth/login)
*/

/**
 * Initialisiert die Login-Seite
 */
function initLogin() {
    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        logIn();
    });
}

/**
 * Log the user into te system
 */
async function logIn()
{
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const response = document.getElementById('response');

    try {
        const result = await fetch("/api/auth/login", {
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
            // Return to homepage in successful login
            window.location.href = "/";
        }
    }catch(err) {
        response.textContent = err.message;
    }

}

// Initialisiere Seite beim Laden
window.addEventListener('load', initLogin);

