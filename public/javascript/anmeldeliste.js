async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('id');

    if (!appointmentId) {
        console.error("No appointment ID provided in URL");
        //window.location.href = "/not-found.html";
        return;
    }

    try {
        const attending = await getAttending(appointmentId);
        updatePage(attending);
    } catch (err) {
        console.error(err);
        //window.location.href = "/not-found.html";
    }
}

async function getAttending(id){
    try{
        const attending = await fetch("/api/private/attending/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({appointmentID: id})
        });

        if (!attending.ok) throw new Error((await attending.json()).message);

        return await attending.json();
    }
    catch(err){
        window.location.href = "/not-found.html";
    }
}

async function updatePage(attending) {
    const tbody = document.getElementById("anmeldeliste-tbody");
    const emptyState = document.getElementById("empty-state");
    const table = document.getElementById("anmeldeliste-table");

    tbody.innerHTML = "";

    if (!Array.isArray(attending) || attending.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    table.style.display = "table";
    emptyState.style.display = "none";

    // Fill table
    attending.forEach(person => {
        const tr = document.createElement("tr");

        const tdFirstName = document.createElement("td");
        tdFirstName.textContent = person.first_name;

        const tdLastName = document.createElement("td");
        tdLastName.textContent = person.last_name;

        const tdEmail = document.createElement("td");
        tdEmail.textContent = person.email;

        tr.appendChild(tdFirstName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdEmail);

        tbody.appendChild(tr);
    });
}


// Start page
window.addEventListener('load', init);
