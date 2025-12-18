async function init()
{
    if (!await getUserIsAuthenticated()) {
        document.getElementById("button-logout").style.display = "none"
        document.getElementById("button-create").style.display = "none"
    }
    else document.getElementById("button-logout").addEventListener("click", logout)


    // Get the private appointments as well in case the user is logged in
    const appointments = await getAppointments();
    appointments.forEach(a => {
        renderAppointment(a);
    })

    document.getElementById("search-button").addEventListener("click", searchAppointment)
}

async function getAppointments()
{
    try {
        // Get the private appointments as well in case the user is logged in
        let appointments = [];
        if (await getUserIsAuthenticated()) appointments = await fetch("/api/private/");
        else appointments = await fetch("/api/public/");
        if (!appointments.ok) throw new Error("Failed to fetch appointments");

        const list = await appointments.json();

        if (list.length > 0) list.sort((a, b) => new Date(a.date) - new Date(b.date));

        return list;
    } catch (error) {
        throw error;
    }
}

async function renderAppointment(appointment) {
    const template = document.getElementById('appointment-template');

    const clone = template.content.cloneNode(true);

    clone.querySelector('.termin-title').textContent = appointment.title;
    clone.querySelector('.termin-badge').textContent = appointmentSoledOut(appointment) ? "Ausgebucht" : "Verfügbar";
    if (appointmentSoledOut(appointment)) {
        clone.querySelector('.termin-badge').classList.add("termin-badge-full");
        clone.querySelector('.detail-button').textContent = "Details anzeigen";
    }
    clone.querySelector('.termin-description').textContent = appointment.description || '';
    clone.querySelector('.date').textContent = appointment.date;
    clone.querySelector('.time').textContent = appointment.time;
    clone.querySelector('.location').textContent = appointment.location;
    clone.querySelector('.deadline').textContent = appointment.deadline;
    clone.querySelector('.btn').href = `/view?id=${appointment.id}`;

    const today = new Date();
    const deadline = new Date(appointment.deadline);
    if (deadline < today) {
        clone.querySelector('.termin-badge').textContent = "Anmeldefrist abgelaufen";
        clone.querySelector('.termin-badge').classList.add("termin-badge-full");
        clone.querySelector('.detail-button').textContent = "Details anzeigen";
    }

    // Enable controls if the user is the owner of the appointment
    const user = await getUsername();
    console.log(user);
    if (user !== null && appointment.owner === user)
    {
        clone.querySelector('.controls').style.display = "block";
        clone.querySelector('.list-button').href = "/anmeldeliste.html?id=" + appointment.id;
        const visEl = clone.querySelector('.termin-visibility');
        clone.querySelector('.update-button').addEventListener("click", async () => {
            const vis = visEl.value;

            try{
                const resp = await fetch("/api/private/change-visibility", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({appointmentID: appointment.id, visibility: vis})
                })

                if (!resp.ok) throw new Error((await resp.json()).message);

                updateButton.style.display = "none";
            } catch (err)
            {
                throw err;
            }
        });
        visEl.value = appointment.visibility;
        const updateButton = clone.querySelector('.update-button');
        visEl.addEventListener("change", async () => {
            updateButton.style.display = "block";
        })
    }

    document.getElementById('termin-list').appendChild(clone);
}

function searchAppointment() {
    const id = document.getElementById("termin-id").value;
    if (id != null && id !== '') window.location.href = `/view?id=${id}`;
}

function appointmentSoledOut(appointment)
{
    return appointment.attending.length >= appointment.max_attending;
}

async function getUserIsAuthenticated()
{
    try {
        const resp = await fetch("/api/private/ping");
        return resp.ok;
    } catch (error) {
        throw error;
    }
}

async function getUsername()
{
    try {
        const resp = await fetch("/api/private/username");
        if (resp.ok) return (await resp.json()).username;
        else return null;
    } catch (error) {
        return null;
    }
}

/**
 * Logg the user out of the system
 */
async function logout()
{
    await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({nothing: "here"})
    });

    // Reload main page
    window.location.reload();
}

window.addEventListener('load', init);