const countriesElem = document.querySelector(".countries");
const dropDown = document.querySelector(".dropDown");
const dropElem = document.querySelector(".drop");
const regionFilters = document.querySelectorAll(".region");
const searchInput = document.querySelector(".search");
const toggleButton = document.querySelector(".toggle");
const moonIcon = document.querySelector(".moon");
const countryModal = document.querySelector(".countryModal");
const back = document.querySelector(".back");

// Fetch and display countries
async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();
      console.log(countries)
    countries.forEach(showCountry);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

function showCountry(data) {
  const country = document.createElement("div");
  country.classList.add("country");

  country.innerHTML = `
    <div class="country-img">
        <img src="${data.flags.png}" alt="Flag of ${data.name.common}">
    </div>
    <div class="country-info">
        <h5 class="countryName">${data.name.common}</h5>
        <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
        <p class="regionName"><strong>Region:</strong> ${data.region}</p>
        <p><strong>Capital:</strong> ${data.capital}</p>
    </div>`;

  country.addEventListener("click", () => showCountryDetail(data));
  countriesElem.appendChild(country);
}

function showCountryDetail(data) {
  countryModal.innerHTML = `
    <button class="back">Back</button>
    <div class="modal">
      <div class="leftModal">
        <img src="${data.flags.png}" alt="Flag of ${data.name.common}">
      </div>
      <div class="rightModal">
        <h1>${data.name.common}</h1>
        <div class="modalInfo">
          <div class="innerLeft inner">
            <p><strong>Name:</strong> ${data.name.common}</p>
            <p><strong>Population:</strong> ${data.population}</p>
            <p><strong>Region:</strong> ${data.region}</p>
            <p><strong>Sub-region:</strong> ${data.subregion}</p>
          </div>
          <div class="innerRight inner">
            <p><strong>Capital:</strong> ${data.capital}</p>
            <p><strong>Top Level Domain, Native Name:</strong> ${data.tld.join(", ") || "N/A"}</p>
            <p><strong>Currencies:</strong> ${formatCurrencies(data.currencies)}</p>
            <p><strong>Languages:</strong> ${formatLanguages(data.languages)}</p>
          </div>
        </div>
      </div>
    </div>`;

  countryModal.querySelector(".back").addEventListener("click", toggleModal);
  toggleModal();
}

function formatCurrencies(currencies) {
  return Object.values(currencies)
    .map(currency => `${currency.name} (${currency.symbol})`)
    .join(", ");
}

function formatLanguages(languages) {
  return Object.values(languages).join(", ");
}

// Event listeners
dropDown.addEventListener("click", () => dropElem.classList.toggle("showDropDown"));

regionFilters.forEach(region => {
  region.addEventListener("click", () => filterByRegion(region.innerText));
});

searchInput.addEventListener("input", () => filterBySearch(searchInput.value.toLowerCase()));

// toggleButton.addEventListener("click", () => {
//   document.body.classList.toggle("dark");
//   moonIcon.classList.toggle("fas");
// });

back.addEventListener("click", toggleModal);

// Filtering functions
function filterByRegion(region) {
  const countries = Array.from(document.getElementsByClassName("regionName"));
  countries.forEach(country => {
    const match = country.innerText.includes(region) || region === "All";
    country.closest(".country").style.display = match ? "grid" : "none";
  });
}

function filterBySearch(query) {
  const countries = Array.from(document.getElementsByClassName("countryName"));
  countries.forEach(country => {
    const match = country.innerText.toLowerCase().includes(query);
    country.closest(".country").style.display = match ? "grid" : "none";
  });
}

// Toggle modal visibility
function toggleModal() {
  countryModal.classList.toggle("show");
}

// Initialize the application
getCountries();


