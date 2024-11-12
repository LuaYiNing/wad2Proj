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
        // Shopping Malls
        { name: "Hougang Mall (Level 3 behind Customer Service Counter)", lat: 1.3713, lng: 103.8932, address: "90 Hougang Avenue 10, Singapore 538766", timing: "10am to 10pm" },
        { name: "Causeway Point (Customer Service at Level 2)", lat: 1.4360, lng: 103.7854, address: "1 Woodlands Square, Singapore 738099", timing: "11am to 10pm" },
        { name: "Compass One Mall (Level 1 between Giordano and Polar Puffs & Cakes)", lat: 1.3925, lng: 103.8959, address: "1 Sengkang Square, Singapore 545078", timing: "10am to 10pm" },
        { name: "NorthPoint City (Customer Service at North Wing, Level 2)", lat: 1.4292, lng: 103.8368, address: "930 Yishun Avenue 2, Singapore 769098", timing: "11am to 10pm" },
        { name: "Waterway Point (Customer Service at East Wing, Level 1, in front of Andersen’s Ice Cream)", lat: 1.4067, lng: 103.9022, address: "83 Punggol Central, Singapore 828761", timing: "10am to 10pm" },
        { name: "Yew Tee Point (Customer Service Counter at Level 1)", lat: 1.3972, lng: 103.7470, address: "21 Choa Chu Kang North 6, Singapore 689578", timing: "10am to 10pm" },
    
        // Central & South Bank Box Locations
        { name: "Alexandra Point (Information Counter at Basement 1)", lat: 1.2841, lng: 103.8020, address: "438 Alexandra Road, Singapore 119958", timing: "11am to 9pm" },
        { name: "Alexandra Technopark (Blk B @ Level 1, Opposite Childcare Centre)", lat: 1.2860, lng: 103.8000, address: "438B Alexandra Road, Singapore 119968", timing: "11am to 9pm" },
        { name: "Frasers Cuppage (Information Counter at Level 1)", lat: 1.3005, lng: 103.8417, address: "51 Cuppage Road #01-06A, Singapore 229469", timing: "9am to 10pm" },
        { name: "Frasers Tower (Beside Ya Kun Kaya Toast at Level 2)", lat: 1.2786, lng: 103.8490, address: "182 Cecil St, Singapore 069547", timing: "9am to 6pm" },
        { name: "Pan Pacific Serviced Suites Beach Road", lat: 1.3008, lng: 103.8605, address: "7500B Beach Road, Singapore 199592", timing: "Not specified" },
        { name: "SCC Straits Ote Ltd (Cross Street Exchange)", lat: 1.2840, lng: 103.8475, address: "18 Cross Street, Singapore 048423", timing: "9am to 6pm" },
    
        // East Bank Box Locations
        { name: "Century Square (Level 3 Information Counter)", lat: 1.3524, lng: 103.9426, address: "2 Tampines Central 5, Singapore 529509", timing: "10am to 10pm" },
        { name: "EastPoint Mall (Customer Service at Level 2)", lat: 1.3432, lng: 103.9534, address: "3 Simei Street, Singapore 528833", timing: "10am to 10pm" },
        { name: "Tampines 1 (Basement 1 Customer Counter)", lat: 1.3544, lng: 103.9440, address: "10 Tampines Central 1, Singapore 529536", timing: "10am to 10pm" },
        { name: "White Sands Mall (Level 2 Customer Service Counter)", lat: 1.3727, lng: 103.9490, address: "1 Pasir Ris Central Street 3, Singapore 518457", timing: "10am to 10pm" },
    
        // Supermarkets
        { name: "Cold Storage (Great World City Entrance)", lat: 1.2931, lng: 103.8324, address: "1 Kim Seng Promenade, #B1-139, Singapore 237994", timing: "10am to 10pm" },
        { name: "Cold Storage (Jelita Shopping Centre Entrance)", lat: 1.3125, lng: 103.7832, address: "293 Holland Rd, #01-01, Singapore 278628", timing: "10am to 10pm" },
        { name: "CS Fresh (The Star Vista)", lat: 1.3068, lng: 103.7890, address: "1 Vista Exchange Green #B1-02 & 35/36, Singapore 138617", timing: "10am to 10pm" },
        { name: "Giant Hypermarket (Suntec City Entrance)", lat: 1.2936, lng: 103.8570, address: "3 Temasek Blvd, #B1-154/155/156, Singapore 038983", timing: "9am to 10pm" },
        { name: "Cold Storage (One North Entrance)", lat: 1.2990, lng: 103.7872, address: "1 Fusionopolis Way, B2-03 One North Connexis, Singapore 138632", timing: "10am to 10pm" },
    
        // West Bank Box Locations
        { name: "Giant Hypermarket (IMM Entrance)", lat: 1.3340, lng: 103.7460, address: "2 Jurong East Street 21, #01-100, Singapore 609601", timing: "9am to 10pm" },
        { name: "Giant Hypermarket (Pioneer Mall Entrance)", lat: 1.3476, lng: 103.7050, address: "Blk 638 #03-01, Jurong West Street 61, Singapore 640638", timing: "9am to 10pm" },
        { name: "CS Fresh (Guthrie House)", lat: 1.3251, lng: 103.7961, address: "1 Fifth Ave, Guthrie House #01-05, Singapore 268802", timing: "10am to 10pm" },
    
        // Special Locations
        { name: "The Foodbank Singapore (Level 1 Reception Roller Cage / Level 3 Warehouse)", lat: 1.3080, lng: 103.7605, address: "218 Pandan Loop @ XPACE, Singapore 128408", timing: "10am to 6pm (Mon to Fri)" }
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

function showNearbyLocations() {
    // Check if the browser supports Geolocation
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const userLocation = new google.maps.LatLng(userLat, userLng);

            // Define a maximum distance (in meters) for "nearby" locations
            const maxDistance = 3000; // 3 km

            // Filter locations based on the distance to the user's location
            const nearbyLocations = allLocations.filter(({ location }) => {
                const markerLocation = new google.maps.LatLng(location.lat, location.lng);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, markerLocation);
                return distance <= maxDistance;
            });

            // Update the map and list with nearby locations
            updateMapMarkers(nearbyLocations);
            updateSearchResults(nearbyLocations);

            // Pan the map to the user's current location
            map.panTo(userLocation);
            map.setZoom(14);

            // Optionally, add a marker for the user's location
            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "You are here",
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                    scaledSize: new google.maps.Size(30, 30),
                },
            });
        },
        (error) => {
            console.error("Error getting location:", error);
            alert("Unable to retrieve your location.");
        }
    );
}

function showAllMarkers() {
    // Reset all filters and show all markers
    markers.forEach(marker => {
        marker.setMap(map);
    });

    updateList('all');

    // Create a new bounds object
    const bounds = new google.maps.LatLngBounds();

    // Extend bounds to include all markers' positions
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });

    // Fit the map to show all markers
    map.fitBounds(bounds);
}

