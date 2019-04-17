'use strict';

// =============================================================
// ================ SEARCH LISTENERS & HANDLERS ================
function watchSearchForm() {
  let searchInput;
  let maxResults;
  $('form').submit(event => {
    event.preventDefault();
    try {
      let rawInput = $('#js-search-parks').val();
      // Input must be at least two contiguous letters. Only commas and spaces allowed as seperators.
      if (!/^(\s*[a-zA-Z]{2}\s*,?)+$/.test(rawInput)) {
        throw Error('Whoops, that won\'t work. Enter full state name(s) like "New York, Massachusetts" or state code(s) like "NY, MA"');
      } else {
        searchInput = rawInput.replace(/\s|,/g, ',');
        maxResults = $('#js-max-results').val();
        getParks(searchInput, maxResults);
      } 
    } catch(error) {
      alert(error.message);
    }
  });
}

function watchSearchResults() {
  $('#js-search-results-list').on('click', '#js-search-result', event => {
    event.preventDefault();
    // Get Park info by some identifier. Maybe use pakrname from THIS and get park code and lon/lat?
    // GOAL: Since the API getter functions store their data in STORE, just pass along some identified that will 
    // act as a key when you pass control to renderModal. Then, in renderModal, use taht key to gather the data you need.
    getAccuweatherLocation(PARKCOORDINATES);// figure out how to get these! from NPS
    getForecast(PARKLOCATIONFROMACCU);
    renderModal();
  });
}

// ===========================================================================
// ======================= QUERY FORMATTING =======================
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

// ==============================================================
// ======================== NPS API CALL ========================

const npsSearchURL = 'https://developer.nps.gov/api/v1/parks?';
const npsApiKey = 'JVeSBRlmeioOK5HNO6ev6IpsIwcPWH1dXgpk2SxN';

function getParks(searchInput, maxResults) {
  const params = {
    'stateCode': searchInput,
    limit: parseInt(maxResults),
    api_key: npsApiKey
  };
  const formattedQuery = formatQueryParams(params);
  const url = searchURL + formattedQuery;
  console.log('nps url for request: ', url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseObj => {
      renderParkSearchResults(responseObj);
      STORE.npsResponse = responseObj;
      console.log('Here\'s the response from NPS: ', responseObj);
    })
    .catch(error => {
      $('#js-error-message').text(`Uh ho... We couldn't complete your request because: ${error.message}`);
    });
}
// ===============================================================
// ================ ACCUWEATHER LOCATION API CALL ================
const LocationSearchURL = '';
const npsApiKey = '';

async function getAccuweatherLocation(parkCoordinates) {
  // Take NPS park coordinates and get a location for the forecast.
  // Pass that location off to the forecast function(s) and store in DB.
  
  // Get park location from the STORE.selectedPark obj, which the search results watcher will update.
  return await fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseObj => {
      getForecast(responseObj);
      STORE.locationResponse = responseObj;
      // console.log('Here\'s the response from AccuWeather\'s Location API: ', responseObj);
    })
    .catch(error => {
      $('#js-error-message').text(`Uh ho... We couldn't complete your request because: ${error.message}`);
    });
}
// ===============================================================
// ================ ACCUWEATHER FORECAST API CALL ================
const forecastSearchURL = '';
const forecastApiKey = '';

async function getForecast(locationResponse) {
  // Get forecast and prepare for storage and rendering.
  return await fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseObj => {
      // RENDERFORECAST() ?
      STORE.forecastResponse = responseObj;
      // console.log('Here\'s the response from AccuWeather\'s Forecast API: ', responseObj);
    })
    .catch(error => {
      $('#js-error-message').text(`Uh ho... We couldn't complete your request because: ${error.message}`);
    });
}
// ======================================================
// ================ GOOGLE MAPS API CALL ================
// const mapsSearchURL = 'https://developer.nps.gov/api/v1/parks?';
// const mapsApiKey = 'JVeSBRlmeioOK5HNO6ev6IpsIwcPWH1dXgpk2SxN';

// ===========================================
// ======== DISPLAY RESULTS (ALL APIS) =======

function renderParkSearchResults(responseObj, maxResults) {
    $('#js-search-results-list').empty();
    for (let i = 0; i < maxResults && i < responseObj.data.length; i++) {
      $('#js-search-results-list').append(
        `<li><h3 id="js-search-result">${responseObj.data[i].fullName}</h3>
        <p><strong>State(s):</strong> ${responseObj.data[i].states}</p>
        <p><strong>Description:</strong> ${responseObj.data[i].description}</p>
        <p><strong>Designation:</strong> ${responseObj.data[i].designation}</p>
        <p><strong>Park Directions:</strong> ${responseObj.data[i].directionsInfo}</p>
        </li>`
      );
    }
    $('#results').removeClass('hidden');
}

function renderForecast(responseObj) {
  // called from renderModal
}

function renderParkInformation() {
  // called from renderModal
  // this function just pulls more info from NPS's response, like hiking and camping info. Or it makes another more if needed, for a diff. endpoint.
}


function renderModal(parkFullName) {
  // this is the master function for the Modal screen. 
  // renderForecast();
  // renderParkInformation();
  // renderMap();
}

// ========= DOCUMENT READY ===========
$(watchSearchForm);
// ====================================