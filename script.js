let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
let result = document.getElementById("result"); // Add this line to access the result container


// Function to convert numbers to words
function numberToWords(number) {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

    // Function to recursively convert a number less than 1000 to words
    function convertLessThanOneThousand(number) {
        let words;

        if (number % 100 < 20) {
            words = units[number % 100];
            number = Math.floor(number / 100);
        } else {
            words = units[number % 10];
            number = Math.floor(number / 10);

            words = tens[number % 10] + ' ' + words;
            number = Math.floor(number / 10);
        }

        if (number === 0) return words;
        return units[number] + ' hundred ' + words;
    }

    if (number === 0) return 'zero';

    let words = '';
    let scaleIndex = 0;

    while (number > 0) {
        if (number % 1000 !== 0) {
            let word = convertLessThanOneThousand(number % 1000);
            words = word + ' ' + scales[scaleIndex] + ' ' + words;
        }
        number = Math.floor(number / 1000);
        scaleIndex++;
    }

    return words.trim();
}

function fetchAutocompleteSuggestions(input) {
    let finalURL = `https://restcountries.com/v3.1/name/${input}?fields=name`;
    fetch(finalURL)
        .then((response) => response.json())
        .then((data) => {
            // Clear previous suggestions
            result.innerHTML = "";
            // Display suggestions
            data.forEach((country) => {
                let suggestion = document.createElement("div");
                suggestion.textContent = country.name.common;
                suggestion.addEventListener("click", () => {
                    countryInp.value = country.name.common;
                    fetchData();
                    result.innerHTML = ""; // Clear suggestions after selection
                });
                result.appendChild(suggestion);
            });
        })
        .catch((error) => {
            console.error("Error fetching autocomplete suggestions:", error);
            result.innerHTML = "<p>Error fetching suggestions</p>";
        });
}

// Event listener for input changes to fetch autocomplete suggestions
countryInp.addEventListener("input", () => {
    let inputValue = countryInp.value;
    if (inputValue.length > 0) {
        fetchAutocompleteSuggestions(inputValue);
    } else {
        result.innerHTML = ""; // Clear suggestions when input is empty
    }
});


function fetchData() {
    let countryName = countryInp.value;
    let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    console.log(finalURL);
    fetch(finalURL)
        .then((response) => response.json())
        .then((data) => {
            let population = data[0].population;
            let populationWords = `(${numberToWords(population)})`; // Convert population number to words
            let populationWithCommas = population.toLocaleString(); // Add commas to population number

            result.innerHTML = `
                <img src="${data[0].flags.svg}" class="flag-img">
                <br>
                <h2>${data[0].name.common}</h2>
                <div class="wrapper">
                    <div class="data-wrapper">
                        <h4>Capital:</h4>
                        <span>${data[0].capital[0]}</span>
                    </div>
                </div>
                <br>
                <div class="wrapper">
                    <div class="data-wrapper">
                        <h4>Continent:</h4>
                        <span>${data[0].continents[0]}</span>
                    </div>
                </div>
                <br>
                 <div class="wrapper">
                    <div class="data-wrapper">
                        <h4>Population:</h4>
                        <span>${populationWithCommas} ${populationWords}</span>
                    </div>
                </div>
                <br>
                <div class="wrapper">
                    <div class="data-wrapper">
                        <h4>Currency:</h4>
                        <span>${
                          data[0].currencies[Object.keys(data[0].currencies)].name
                        } - ${Object.keys(data[0].currencies)[0]}</span>
                    </div>
                </div>
                <br>
                 <div class="wrapper">
                    <div class="data-wrapper">
                        <h4>Common Languages:</h4>
                        <span>${Object.values(data[0].languages)
                          .toString()
                          .split(",")
                          .join(", ")}</span>
                    </div>
                </div>
              `;
        })
        .catch(() => {
            if (countryName.length == 0) {
                result.innerHTML = `<h3>The input field cannot be empty</h3>`;
            } else {
                result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
            }
        });
}

// Event listener for clicking the search button
searchBtn.addEventListener('click', fetchData);

// Event listener for pressing Enter key in the location input field
countryInp.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        fetchData();
    }
});
