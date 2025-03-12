document.addEventListener("DOMContentLoaded", () => {
    fetchEquipment(); // Fetch real data or fallback to sample data
    fetchAllocation();
    initMap();

    document.getElementById("searchInput").addEventListener("input", function () {
        filterEquipment(this.value.toLowerCase());
    });

    document.getElementById("toggleDarkMode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("loadSampleData").addEventListener("click", loadSampleData);
});

// ✅ Fetch Equipment Data
function fetchEquipment() {
    fetch("http://localhost:5000/api/equipment")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayEquipment(data);
                updateMapWithMarkers(data);
            } else {
                console.warn("⚠️ No equipment found, use 'Load Sample Data' button.");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching equipment:", error);
        });
}

// ✅ Display Equipment Data
function displayEquipment(equipment) {
    const container = document.getElementById("equipmentContainer");
    container.innerHTML = ""; 

    equipment.forEach(item => {
        const statusText = item.quantity > 0 ? "Available" : "Unavailable";
        const statusClass = item.quantity > 0 ? "status-available" : "status-unavailable";

        const card = `
            <div class="col-md-4">
                <div class="card p-3">
                    <h5><strong>${item.name}</strong></h5>
                    <p><strong>Category:</strong> ${item.category || "N/A"}</p>
                    <p><strong>Quantity:</strong> ${item.quantity || 0}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// ✅ Search Equipment
function filterEquipment(searchValue) {
    document.querySelectorAll(".card").forEach(card => {
        const name = card.querySelector("h5").textContent.toLowerCase();
        card.parentElement.style.display = name.includes(searchValue) ? "block" : "none";
    });
}

// ✅ Initialize Google Map
function initMap() {
    const location = { lat: 37.7749, lng: -122.4194 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: location
    });

    fetch("http://localhost:5000/api/equipment")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateMapWithMarkers(data);
            } else {
                console.warn("⚠️ No real locations found.");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching locations:", error);
        });
}

// ✅ Update Google Map with Equipment Locations
function updateMapWithMarkers(equipment) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 37.7749, lng: -122.4194 }
    });

    equipment.forEach(item => {
        if (item.location) {
            new google.maps.Marker({
                position: item.location,
                map: map,
                title: item.name
            });
        }
    });
}

// ✅ Fetch and Display Optimized Allocation
function fetchAllocation() {
    fetch("http://localhost:5000/api/optimized-allocation")
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById("allocation-results");
            tableBody.innerHTML = "";

            if (data.output) {
                let results;
                try {
                    results = JSON.parse(data.output);
                } catch (error) {
                    console.error("❌ JSON Parsing Error:", error);
                    tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Invalid data format</td></tr>`;
                    return;
                }

                results.forEach(item => {
                    let row = `<tr>
                        <td>${item.facility}</td>
                        <td>${item.equipment}</td>
                        <td>${item.route}</td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">No data available</td></tr>`;
            }
        })
        .catch(error => {
            console.error("❌ Fetch Error:", error);
            document.getElementById("allocation-results").innerHTML =
                `<tr><td colspan="3" class="text-center text-danger">Error fetching data</td></tr>`;
        });
}

// ✅ Load Sample Equipment & Allocation Data
function loadSampleData() {
    console.log("📦 Loading sample data...");

    const sampleEquipment = [
        { name: "Ventilator", category: "ICU", quantity: 5, location: { lat: 37.7749, lng: -122.4194 } },
        { name: "Oxygen Cylinder", category: "Emergency", quantity: 10, location: { lat: 37.7849, lng: -122.4094 } },
        { name: "ECG Machine", category: "Cardiology", quantity: 2, location: { lat: 37.7649, lng: -122.4294 } }
    ];
    
    displayEquipment(sampleEquipment);
    updateMapWithMarkers(sampleEquipment);

    const sampleAllocation = [
        { facility: "Hospital A", equipment: "Ventilator", route: "Optimal Route 1" },
        { facility: "Clinic B", equipment: "Oxygen Cylinder", route: "Optimal Route 2" },
        { facility: "Health Center C", equipment: "ECG Machine", route: "Optimal Route 3" }
    ];

    let tableBody = document.getElementById("allocation-results");
    tableBody.innerHTML = "";
    sampleAllocation.forEach(item => {
        let row = `<tr>
            <td>${item.facility}</td>
            <td>${item.equipment}</td>
            <td>${item.route}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    console.log("✅ Sample data loaded successfully!");
}
