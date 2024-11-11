window.initMap = function () {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.3521, lng: 103.8198 },
        zoom: 12,
    });

    const donationDrives = [
        { name: "Food Bank Singapore", lat: 1.2795, lng: 103.8480, address: "39 Keppel Rd, Singapore 089065" },
        { name: "Willing Hearts", lat: 1.3120, lng: 103.8860, address: "11 Jalan Ubi, Block 6, #01-51, Singapore 409074" },
        { name: "Food from the Heart", lat: 1.3448, lng: 103.8731, address: "130 Joo Seng Rd, #03-01, Singapore 368357" }
    ];

    const driveList = document.getElementById("driveList");

    donationDrives.forEach((drive) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = `${drive.name} - ${drive.address}`;
        driveList.appendChild(listItem);

        const marker = new google.maps.Marker({
            position: { lat: drive.lat, lng: drive.lng },
            map: map,
            title: drive.name,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<h6>${drive.name}</h6><p>${drive.address}</p><a href="https://www.google.com/maps/dir/?api=1&destination=${drive.lat},${drive.lng}" target="_blank">Get Directions</a>`,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        listItem.addEventListener("click", () => {
            map.panTo(marker.getPosition());
            map.setZoom(14);
            infoWindow.open(map, marker);
        });
    });
};
