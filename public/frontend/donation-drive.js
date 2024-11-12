let map;
let markers = [];
const allLocations = [];

// Attach functions to the global window object
window.initMap = initMap;
window.filterMarkers = filterMarkers;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.3521, lng: 103.8198 },
        zoom: 12,
    });

    const markerIcons = {
        foodBank: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(30, 30),
        },
        communityFridge: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            scaledSize: new google.maps.Size(30, 30),
        },
        foodBox: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(30, 30),
        },
    };

    fetchFoodBankLocations(markerIcons);
    fetchCommunityFridgeLocations(markerIcons);
    addFoodBoxLocations(markerIcons);
}

function fetchFoodBankLocations(markerIcons) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: { lat: 1.3521, lng: 103.8198 },
        radius: 15000,
        query: 'food bank',
        type: ['establishment', 'point_of_interest'],
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                // Filter out irrelevant results based on the name
                if (!isIrrelevantPlace(place.name)) {
                    getPlaceDetails(place, 'foodBank', markerIcons);
                }
            });
        } else {
            console.error('Error fetching Food Bank locations:', status);
        }
    });
}

// Helper function to filter out irrelevant places
function isIrrelevantPlace(name) {
    const irrelevantKeywords = ['Recipe', 'Corner', 'Restaurant', 'Bar', 'Cafe'];
    return irrelevantKeywords.some((keyword) => name.includes(keyword));
}


// Fetch Community Fridge locations dynamically
function fetchCommunityFridgeLocations(markerIcons) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: { lat: 1.3521, lng: 103.8198 },
        radius: 15000,
        query: 'community fridge',
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                getPlaceDetails(place, 'communityFridge', markerIcons);
            });
        } else {
            console.error('Error fetching Community Fridge locations:', status);
        }
    });
}

function getPlaceDetails(place, type, markerIcons) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'opening_hours'],
    };

    service.getDetails(request, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const openingHours = placeDetails.opening_hours ? formatOpeningHours(placeDetails.opening_hours.weekday_text) : 'Not specified';
            const location = {
                name: placeDetails.name,
                lat: placeDetails.geometry.location.lat(),
                lng: placeDetails.geometry.location.lng(),
                address: placeDetails.formatted_address || 'No address available',
                timing: openingHours,
                type: type,
            };
            createMarker(location, markerIcons);
            addToList(location);
        } else {
            console.error('Error fetching place details:', status);
        }
    });
}

// Function to add location to the side list
function addToList(location) {
    const driveList = document.getElementById('driveList');
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `<strong>${location.name}</strong><br>${location.address}<br><small>Timing: ${location.timing}</small>`;

    // Add click event to pan to the location on the map
    listItem.addEventListener('click', () => {
        map.panTo({ lat: location.lat, lng: location.lng });
        map.setZoom(14);
    });

    driveList.appendChild(listItem);
}


// Format opening hours
function formatOpeningHours(weekdayText) {
    return weekdayText.join('<br>');
}

// Add predefined Food Box locations
function addFoodBoxLocations(markerIcons) {
    const foodBoxLocations = [
        { name: "Hougang Mall", lat: 1.3713, lng: 103.8932, address: "90 Hougang Avenue 10, Singapore 538766", timing: "10am to 10pm" },
        { name: "Causeway Point", lat: 1.4360, lng: 103.7854, address: "1 Woodlands Square, Singapore 738099", timing: "11am to 10pm" },
        { name: "Compass One Mall", lat: 1.3925, lng: 103.8959, address: "1 Sengkang Square, Singapore 545078", timing: "10am to 10pm" },
        { name: "NorthPoint City", lat: 1.4292, lng: 103.8368, address: "930 Yishun Avenue 2, Singapore 769098", timing: "11am to 10pm" },
        { name: "Waterway Point", lat: 1.4067, lng: 103.9022, address: "83 Punggol Central, Singapore 828761", timing: "10am to 10pm" },
        { name: "Yew Tee Point", lat: 1.3972, lng: 103.7470, address: "21 Choa Chu Kang North 6, Singapore 689578", timing: "10am to 10pm" },
    ];

    foodBoxLocations.forEach((location) => {
        location.type = 'foodBox';
        createMarker(location, markerIcons);
    });
}

// Create marker for each location
function createMarker(location, markerIcons) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: markerIcons[location.type],
        type: location.type,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h6>${location.name}</h6><p>${location.address}</p><p>Timing:<br>${location.timing}</p><a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" target="_blank">Get Directions</a>`,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

// Filter markers based on selected type
function filterMarkers(type) {
    markers.forEach((marker) => {
        if (type === 'all' || marker.type === type) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
}

// Toggle Sidebar on Mobile
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.createElement('button');
toggleBtn.classList.add('sidebar-toggle-btn');
toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

