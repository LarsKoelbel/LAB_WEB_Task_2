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
    const countNumber = document.getElementById("count-number");

    tbody.innerHTML = "";

    if (!Array.isArray(attending) || attending.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "block";
        if (countNumber) countNumber.textContent = "0";
        return;
    }

    table.style.display = "table";
    emptyState.style.display = "none";
    if (countNumber) countNumber.textContent = attending.length.toString();

    // Fill table
    attending.forEach((person, index) => {
        const tr = document.createElement("tr");

        // Nummer
        const tdNumber = document.createElement("td");
        tdNumber.className = "td-number";
        tdNumber.textContent = (index + 1).toString();

        const tdFirstName = document.createElement("td");
        tdFirstName.textContent = person.first_name;

        const tdLastName = document.createElement("td");
        tdLastName.textContent = person.last_name;

        const tdEmail = document.createElement("td");
        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${person.email}`;
        emailLink.textContent = person.email;
        emailLink.className = "email-link";
        tdEmail.appendChild(emailLink);

        tr.appendChild(tdNumber);
        tr.appendChild(tdFirstName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdEmail);

        tbody.appendChild(tr);
    });
}


// Start page
window.addEventListener('load', init);
