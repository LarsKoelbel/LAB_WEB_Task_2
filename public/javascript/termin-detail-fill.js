async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('id');

    if (!appointmentId) {
        console.error("No appointment ID provided in URL");
        window.location.href = "/not-found.html";
        return;
    }

    try {
        const appointment = await getAppointment(appointmentId);
        updatePage(appointment);
    } catch (err) {
        console.error(err);
        window.location.href = "/not-found.html";
    }

    document.getElementById('anmeldung-form').addEventListener('submit', (event) => {
        event.preventDefault();
        signOn(appointmentId);
    });
}

// Fetch appointment data
async function getAppointment(id) {
    try {
        const response = await fetch("/api/public/get-single", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ appointmentID: id })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Appointment not found");
        }

        return await response.json();
    } catch (err) {
        throw new Error("Error fetching appointment: " + err.message);
    }
}

// Fill the page with appointment data
function updatePage(appointment) {
    document.getElementById('termin-title').textContent = appointment.title;
    document.getElementById('termin-description').textContent = appointment.description || '-';
    document.getElementById('termin-datum').textContent = appointment.date;
    document.getElementById('termin-uhrzeit').textContent = appointment.time;
    document.getElementById('termin-ort').textContent = appointment.location;
    document.getElementById('termin-anmeldefrist').textContent = appointment.deadline;

    const statusEl = document.getElementById('termin-status');
    if (appointment.attending.length >= appointment.max_attending) {
        statusEl.textContent = "Ausgebucht";
        document.getElementById('anmeldung-section').style.display = "none";
        document.getElementById('termin-unavailable').style.display = "block";
        statusEl.classList.add("termin-badge-full");
    } else {
        statusEl.textContent = "Verfügbar";
    }


    const today = new Date();
    const deadline = new Date(appointment.deadline);
    if (deadline < today) {
        document.getElementById('anmeldung-section').style.display = "none";
        document.getElementById('termin-unavailable').style.display = "block";
        statusEl.textContent = "Anmeldefrist abgelaufen";
        statusEl.classList.add("termin-badge-full");
    }
}

async function signOn(id){
    try {
        const first_name = document.getElementById('vorname').value;
        const last_name = document.getElementById('nachname').value;
        const email = document.getElementById('email').value;

        const resp = await fetch("/api/public/signon/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email,
                appointmentID: id
            })
        })

        if (!resp.ok) throw new Error((await resp.json()).message);
        else {
            document.getElementById('anmeldung-section').style.display = "none";
            document.getElementById('termin-signon-complete').style.display = "block";
        }
    }catch (err)
    {
        throw err;
    }
}

// Start page
window.addEventListener('load', init);
