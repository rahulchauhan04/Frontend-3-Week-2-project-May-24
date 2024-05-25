document.addEventListener("DOMContentLoaded", () => {
     const GEOAPIFY_API_KEY = "ccb088df8ccc47199f03f09a47aea694"; // Replace 'YOUR_API_KEY' with your actual Geoapify API key
 
     function fetchTimezoneByCoordinates(lat, lon, displayElementPrefix) {
         const url = `https://api.geoapify.com/v1/geocode/search?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;
 
         fetch(url)
             .then(response => response.json())
             .then(data => {
                 if (data.features && data.features.length > 0) {
                     const timezoneData = data.features[0].properties;
                     document.getElementById(`${displayElementPrefix}-timezone-name`).textContent = timezoneData.timezone.name;
                     document.getElementById(`${displayElementPrefix}-lat`).textContent = timezoneData.lat;
                     document.getElementById(`${displayElementPrefix}-long`).textContent = timezoneData.lon;
                     document.getElementById(`${displayElementPrefix}-offset-std`).textContent = timezoneData.timezone.offset_STD;
                     document.getElementById(`${displayElementPrefix}-offset-std-seconds`).textContent = timezoneData.timezone.offset_STD_seconds;
                     document.getElementById(`${displayElementPrefix}-offset-dst`).textContent = timezoneData.timezone.offset_DST;
                     document.getElementById(`${displayElementPrefix}-offset-dst-seconds`).textContent = timezoneData.timezone.offset_DST_seconds;
                     document.getElementById(`${displayElementPrefix}-country`).textContent = timezoneData.country;
                     document.getElementById(`${displayElementPrefix}-postcode`).textContent = timezoneData.postcode;
                     document.getElementById(`${displayElementPrefix}-city`).textContent = timezoneData.city;
                 } else {
                     throw new Error("No timezone data found.");
                 }
             })
             .catch(error => {
                 console.error(error);
                 document.getElementById("error-message").textContent = "An error occurred while fetching the timezone data.";
             });
     }
 
     function fetchTimezoneByAddress(address) {
         const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`;
 
         fetch(url)
             .then(response => response.json())
             .then(data => {
                 if (data.features && data.features.length > 0) {
                     const { lat, lon } = data.features[0].properties;
                     fetchTimezoneByCoordinates(lat, lon, "result");
                 } else {
                     throw new Error("No timezone data found for the provided address.");
                 }
             })
             .catch(error => {
                 console.error(error);
                 document.getElementById("error-message").textContent = "An error occurred while fetching the timezone data.";
             });
     }
 
     // Fetch current timezone based on geolocation
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
             const { latitude, longitude } = position.coords;
             fetchTimezoneByCoordinates(latitude, longitude, "current");
         }, error => {
             console.error(error);
             document.getElementById("error-message").textContent = "Unable to retrieve your location.";
         });
     } else {
         document.getElementById("error-message").textContent = "Geolocation is not supported by your browser.";
     }
 
     // Fetch timezone by address
     document.getElementById("submit-address").addEventListener("click", () => {
         const address = document.getElementById("address-input").value;
         if (address.trim() !== "") {
             fetchTimezoneByAddress(address);
         } else {
             document.getElementById("error-message").textContent = "Please enter an address.";
         }
     });
 });