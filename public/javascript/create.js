function init(){
    document.getElementById('termin-erstellen-form').addEventListener('submit', (event) => {
        event.preventDefault();
        createAppointment();
    });
}

async function createAppointment(){
    const appointment = {
        title: document.getElementById('termin-titel').value.trim(),
        description: document.getElementById('termin-beschreibung').value.trim(),
        date: document.getElementById('termin-datum').value,
        time: document.getElementById('termin-uhrzeit').value.trim(),
        location: document.getElementById('termin-ort').value.trim(),
        deadline: document.getElementById('termin-anmeldefrist').value,
        max_attending: parseInt(document.getElementById('termin-max-teilnehmer').value, 10) || 0,
        visibility: document.getElementById('termin-visibility').value
    };

    try {
        const response = await fetch('/api/private/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointment),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error);
        }

        const result = await response.json();
        // Redirect to main page
        window.location.href = "/";
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('load', init);