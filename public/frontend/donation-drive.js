let map;
let markers = [];
const allLocations = [];

// Attach functions to the global window object
window.initMap = initMap;
window.filterMarkers = filterMarkers;
window.showNearbyLocations = showNearbyLocations;
window.showAllMarkers = showAllMarkers;
window.searchLocations = searchLocations;

function initMap() {
    // Singapore's lat and lng
    const singaporeCenter = { lat: 1.3521, lng: 103.8198 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: singaporeCenter,
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

    // Load community fridges directly from extracted data
    const communityFridges = [
        { "name": "Bedok Sunflower Community Fridge", "description": "Blk 33 Bedok South Ave 2, S(460033)", "lat": 1.3228896, "lng": 103.9390978 },
        { "name": "Bedok South Orchid Community Fridge", "description": "No description available", "lat": 1.3206364, "lng": 103.9371033 },
        { "name": "112 Bishan Zone 1 RC Community Fridge", "description": "No description available", "lat": 1.3468281, "lng": 103.8490256 },
        { "name": "145 Bishan Zone 5 RC Community Fridge", "description": "No description available", "lat": 1.3446848, "lng": 103.8547894 },
        { "name": "Boon Lay Community Fridge", "description": "Blk 190 Boon Lay Drive, S(640190)", "lat": 1.34527, "lng": 103.7120871 },
        { "name": "Marine Terrace Community Fridge", "description": "Level 1 Opp RC, Blk 20 Marine Terrace, S(440020)", "lat": 1.3040113, "lng": 103.9148975 },
        { "name": "Punggol Community Fridge", "description": "Blk 616 Punggol Drive, #01-01", "lat": 1.4018114, "lng": 103.91219 },
        { "name": "Stirling Community Fridge", "description": "Blk 166 Stirling Road, S(140166)", "lat": 1.2906724, "lng": 103.8023356 },
        { "name": "Tampines Community Fridge", "description": "No description available", "lat": 1.3603745, "lng": 103.952174 },
        { "name": "358 Tampines Street 33", "description": "Blk 358 Tampines Street 33, #01-666, Singapore 520358", "lat": 1.3543935, "lng": 103.9608771 },
        { "name": "Teck Whye Community Fridge", "description": "Blk 165A Teck Whye Crescent, S(681165)", "lat": 1.3826908, "lng": 103.7535982 },
        { "name": "170 Toa Payoh Community Fridge", "description": "No description available", "lat": 1.3313414, "lng": 103.8426842 },
        { "name": "261 Toa Payoh Community Fridge", "description": "No description available", "lat": 1.3338487, "lng": 103.8554802 },
        { "name": "Xin Yuan Community Fridge", "description": "Blk 205 Toa Payoh North, S(310205)", "lat": 1.342017, "lng": 103.8482851 },
        { "name": "Woodlands Community Fridge", "description": "718 Woodlands Avenue 6 S(730718)", "lat": 1.4416521, "lng": 103.8010688 },
        { "name": "508 Yishun Community Fridge", "description": "508B Yishun Avenue 4 S(762508)", "lat": 1.414241, "lng": 103.8392312 },
    ];

    // Add community fridge markers
communityFridges.forEach(fridge => {
    createMarker({
        name: fridge.name,
        lat: fridge.lat,
        lng: fridge.lng,
        address: fridge.description,
        timing: 'Not specified',
        type: 'communityFridge'
    }, markerIcons);
});

// Update the list with all locations, including community fridges
updateList('all');



    // Add other markers (food banks and food boxes)
    fetchFoodBankLocations(markerIcons);
    addFoodBoxLocations(markerIcons);

    // Display all markers by default
    filterMarkers('all');
}

function createMarker(location, markerIcons) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: markerIcons[location.type],
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h6>${location.name}</h6><p>${location.address}</p><p>Timing:<br>${location.timing}</p><a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" target="_blank">Get Directions</a>`,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);

    // Ensure the location is added to `allLocations`
    if (!allLocations.some(({ location: loc }) => loc.name === location.name && loc.type === location.type)) {
        allLocations.push({ location, marker });
        addToList(location);
    }
}

updateList('all');



// Function to create a marker for Community Fridge
function createCommunityFridgeMarker(name, lat, lng, description, markerIcons) {
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: name,
        icon: markerIcons.communityFridge,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h6>${name}</h6><p>${description}</p><p>Location: ${lat}, ${lng}</p>`,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

// Fetch Food Bank locations
function fetchFoodBankLocations(markerIcons) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: { lat: 1.3521, lng: 103.8198 }, // Singapore's center
        radius: 15000, // 15 km radius
        query: 'food bank',
        type: ['establishment', 'point_of_interest'],
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                // Ensure no "Community Fridge" places are added to the Food Bank list
                if (!isIrrelevantPlace(place.name, 'foodBank')) {
                    getPlaceDetails(place, 'foodBank', markerIcons);
                }
            });
        } else {
            console.error('Error fetching Food Bank locations:', status);
        }
    });
}

// Helper function to filter out irrelevant places from food banks
function isIrrelevantPlace(name, type) {
    const irrelevantKeywords = ['Recipe', 'Corner', 'Restaurant', 'Bar', 'Cafe'];
    const excludedFoodBankPlaces = [
        "INDIAN RECIPE CORNER",
        "binheyunzhi" 
    ];

    const excludedCommunityFridges = [
        "Community Fridge",  // Exclude all community fridges from Food Banks
    ];

    if (type === 'foodBank') {
        // For Food Bank, exclude "Community Fridge" places
        return excludedFoodBankPlaces.some((place) => name.includes(place)) ||
            excludedCommunityFridges.some((place) => name.includes(place));
    }

    // Allow Community Fridges to show up in their own category
    return irrelevantKeywords.some((keyword) => name.includes(keyword));
}

// Fetch Community Fridge locations dynamically
function fetchCommunityFridgeLocations(markerIcons) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: { lat: 1.3521, lng: 103.8198 }, // Singapore's center
        radius: 15000, // 15 km radius
        query: 'community fridge',
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                // Ensure "Community Fridge" locations are categorized properly as Community Fridges
                if (!isIrrelevantPlace(place.name, 'communityFridge')) {
                    getPlaceDetails(place, 'communityFridge', markerIcons);
                }
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
            // Ensure the location is added only once and is correctly categorized
            createMarker(location, markerIcons);
            addToList(location);
        } else {
            console.error('Error fetching place details:', status);
        }
    });
}

// Function to add location to the side list
function addToList(location) {
    // Check for duplicates by comparing name and type
    if (!allLocations.some(({ location: loc }) => loc.name === location.name && loc.type === location.type)) {
        allLocations.push({ location, marker: null });
        
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
}

// Format opening hours
function formatOpeningHours(weekdayText) {
    return weekdayText.join('<br>');
}

// Add predefined Food Box locations
function addFoodBoxLocations(markerIcons) {
    const foodBoxLocations = [
        { name: "Food Box - Hougang Mall", lat: 1.3713, lng: 103.8932, address: "90 Hougang Avenue 10, Singapore 538766", timing: "10am to 10pm" },
        { name: "Food Box - Causeway Point", lat: 1.4360, lng: 103.7854, address: "1 Woodlands Square, Singapore 738099", timing: "11am to 10pm" },
        { name: "Food Box - Compass One Mall", lat: 1.3925, lng: 103.8959, address: "1 Sengkang Square, Singapore 545078", timing: "10am to 10pm" },
        { name: "Food Box - NorthPoint City", lat: 1.4292, lng: 103.8368, address: "930 Yishun Avenue 2, Singapore 769098", timing: "11am to 10pm" },
        { name: "Food Box - Waterway Point", lat: 1.4067, lng: 103.9022, address: "83 Punggol Central, Singapore 828761", timing: "10am to 10pm" },
        { name: "Food Box - Yew Tee Point", lat: 1.3972, lng: 103.7470, address: "21 Choa Chu Kang North 6, Singapore 689578", timing: "10am to 10pm" },
    ];

    foodBoxLocations.forEach((location) => {
        location.type = 'foodBox';
        createMarker(location, markerIcons);
        addToList(location);
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

    // Ensure the location is added to `allLocations` and call `addToList` directly
    const locationExists = allLocations.some(({ location: loc }) => loc.name === location.name && loc.type === location.type);
    if (!locationExists) {
        allLocations.push({ location, marker });
        addToList(location);
    }
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

    updateList(type);
}

// Update the list based on the selected filter
function updateList(type) {
    const driveList = document.getElementById('driveList');
    driveList.innerHTML = '';

    const filteredLocations = allLocations.filter(({ location }) => {
        return type === 'all' || location.type === type;
    });

    filteredLocations.forEach(({ location }) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<strong>${location.name}</strong><br>${location.address}<br><small>Timing: ${location.timing}</small>`;
        listItem.addEventListener('click', () => {
            map.panTo({ lat: location.lat, lng: location.lng });
            map.setZoom(14);
        });
        driveList.appendChild(listItem);
    });

    if (!driveList.hasChildNodes()) {
        const message = document.createElement("p");
        message.textContent = "No results found.";
        message.classList.add("text-muted", "text-center", "mt-3");
        driveList.appendChild(message);
    }
}
function updateMapMarkers(filteredLocations) {
    // Hide all markers
    markers.forEach(marker => marker.setMap(null));

    // Show only the markers that match the search results
    filteredLocations.forEach(({ marker }) => {
        marker.setMap(map);
    });
}

function searchLocations(query) {
    if (query.trim() === "") {
        // If the search query is empty, show all markers
        filterMarkers('all');
        updateList('all');
        return;
    }

    const filteredLocations = allLocations.filter(({ location }) => {
        return location.name.toLowerCase().includes(query.toLowerCase()) ||
               location.address.toLowerCase().includes(query.toLowerCase());
    });

    updateMapMarkers(filteredLocations);
    updateSearchResults(filteredLocations);
}



// Update the search results in the list
function updateSearchResults(filteredLocations) {
    const driveList = document.getElementById('driveList');
    driveList.innerHTML = '';

    if (filteredLocations.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No results found.";
        message.classList.add("text-muted", "text-center", "mt-3");
        driveList.appendChild(message);
        return;
    }

    filteredLocations.forEach(({ location }) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<strong>${location.name}</strong><br>${location.address}<br><small>Timing: ${location.timing}</small>`;
        
        listItem.addEventListener('click', () => {
            map.panTo({ lat: location.lat, lng: location.lng });
            map.setZoom(14);
        });

        driveList.appendChild(listItem);
    });
}

