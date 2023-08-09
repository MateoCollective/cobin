//==============================
// Author: (github.com/bradsec)
//==============================

const jsonFilePaths = ['json/woolworths.json', 'json/coles.json', ];

// Fetch JSON Data function
const fetchJSONData = (url) => {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${
                response.status
            }`);
        }
        return response.json();
    }).catch(error => {
        console.error(`There was an error with fetching ${url}:`, error);
        return [];
    });
};

const itemsPerPage = 20;
let currentIndex = 0;
let originalData = [];
let mergedData = [];
let hasMoreData = true;

const formatPrice = price => {
    const formattedPrice = parseFloat(price.toFixed(2)).toString();
    if (formattedPrice.includes('.')) {
        const decimalPart = formattedPrice.split('.')[1];
        return decimalPart.length === 1 ? `${formattedPrice}0` : formattedPrice;
    } else {
        return formattedPrice;
    }
};

const isNearBottom = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    const threshold = 150;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight + threshold) >= scrollHeight;
    return scrolledToBottom;
}

const resultOutputEl = document.getElementById('results');

const displayResults = async results => { // Set time out spinner
    await new Promise(resolve => setTimeout(resolve, 0));

    resultOutputEl.innerHTML += `
    <section class="card-deck">
      ${
        results.map(result => `
        <article class="card">
          <p class="store ${result.store}">${result.store}</p>
          <picture><img src="${
            result.imagenewurl
        }" class="prod-image" /></picture>
          <div class="card-content">
            <p class="saving"><span class="save">SAVE </span>$${
            formatPrice(result.saving)
        }</p>
            <p class="pricewas">WAS <span>$${
            formatPrice(result.pricewas)
        }</span></p>
            <p class="prod-name">${
            result.name
        }</p>
            <div class="center"><p class="pricenow ${
            result.store
        }">$${
            formatPrice(result.pricenow)
        }</p></div>
          </div>
        </article>
      `).join('')
    }  
    </section>
    `;
};

let scrollCheckInterval = null;

const startScrollCheckInterval = () => {
    scrollCheckInterval = setInterval(async () => {

        if (isNearBottom() && hasMoreData) {
            document.getElementById('spinner').style.display = "block";

            const newData = mergedData.slice(currentIndex, currentIndex + itemsPerPage);
            if (newData.length > 0) {
                await displayResults(newData);
                currentIndex += itemsPerPage;
                if (currentIndex < mergedData.length) {} else {
                    hasMoreData = false;
                    clearInterval(scrollCheckInterval);
                }
            } else {
                hasMoreData = false;
                clearInterval(scrollCheckInterval);
            }
            document.getElementById('spinner').style.display = "none";
        }
    }, 500);
}

const searchResultCount = document.getElementById('search-result-count');
const jsonFileNameDiv = document.getElementById('jsonFileNames');
const sortOrderElement = document.getElementById('sort-order');
const sortDirectionElement = document.getElementById('sort-direction');

const sortData = () => {
    const sortOrder = sortOrderElement.value;
    const sortDirection = sortDirectionElement.value;

    mergedData.sort((a, b) => {
        let comparison = 0;

        if (sortOrder === 'name') { // Sort alphabetically if sorting by name
            comparison = a[sortOrder].localeCompare(b[sortOrder]);
        } else { // Otherwise sort numerically
            comparison = a[sortOrder] - b[sortOrder];
        }

        // Reverse order if sorting in descending order
        if (sortDirection === 'descending') {
            comparison *= -1;
        }

        return comparison;
    });

    currentIndex = 0;
    hasMoreData = true;
    resultOutputEl.innerHTML = '';
    clearInterval(scrollCheckInterval);
    startScrollCheckInterval();
}

Promise.all(jsonFilePaths.map((filePath) => {
    return fetchJSONData(filePath);
})).then(dataArray => {
    dataArray.forEach((data, i) => {
        const fileName = jsonFilePaths[i].split('/').pop();
        const p = document.createElement('p');
        p.innerHTML = `Data loaded from: <a href="json/${fileName}" target="_blank"><strong>${fileName}</strong></a>`;
        jsonFileNameDiv.appendChild(p);
    });

    originalData = dataArray.flat();
    mergedData = [...originalData];

    // Sort the merged data right after it's formed
    sortData();

    if (mergedData.length === 0) {
        searchResultCount.innerHTML = `<div class="tag-full is-red">No results found</div>`;
    } else {
        searchResultCount.innerHTML = `<div class="tag-lead is-light">Total Records</div><div class="tag-tail is-blue">${mergedData.length}</div>`;
    }
    sortOrderElement.addEventListener('change', sortData);
    sortDirectionElement.addEventListener('change', sortData);

    displayResults(mergedData.slice(currentIndex, currentIndex + itemsPerPage));
    currentIndex += itemsPerPage;

    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', () => { // Get the search term and split it into individual keywords
        const searchTerm = searchBox.value.trim().toLowerCase().split(' ');
        // Filter the originalData based on the search keywords
        mergedData = originalData.filter(result => {
            const lowerCaseName = result.name.toLowerCase();
            const lowerCaseStore = result.store.toLowerCase();
            // Check if all the keywords match the product name or store
            return searchTerm.every(term => lowerCaseName.includes(term) || lowerCaseStore.includes(term));
        });

        sortData();

        searchBox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchBox.blur();
            }
        });

        // Update the search result count
        if (mergedData.length === 0) {
            searchResultCount.innerHTML = `<div class="tag-full is-red">No results found</div>`;
            hasMoreData = false;
        } else if (mergedData.length === 1) {
            searchResultCount.innerHTML = `<div class="tag-full is-green">1 result</div>`;;
            hasMoreData = false;
        } else {
            searchResultCount.innerHTML = `<div class="tag-full is-green">${mergedData.length} results</div>`;
            hasMoreData = true;
        }

        // Clear the previous results and display the filtered results
        resultOutputEl.innerHTML = '';
        displayResults(mergedData.slice(0, itemsPerPage));
        currentIndex = itemsPerPage;
        clearInterval(scrollCheckInterval);
        startScrollCheckInterval();
    });

    // Counting the items for Woolworths and Coles
    let woolworthsTotalCount = 0;
    let colesTotalCount = 0;
    let woolworthsHalfPriceCount = 0;
    let colesHalfPriceCount = 0;

    mergedData.forEach(result => {
        if (result.store === 'Woolworths') {
            woolworthsTotalCount++;
            if (result.saving >= result.pricewas * 0.5) {
                woolworthsHalfPriceCount++;
            }
        } else if (result.store === 'Coles') {
            colesTotalCount++;
            if (result.saving >= result.pricewas * 0.5) {
                colesHalfPriceCount++;
            }
        }
    });

    document.getElementById('coles-total-count').innerHTML = `<div class="tag-bind"><div class="tag-lead is-dark">Coles</div><div class="tag-tail is-blue">${colesTotalCount}</div></div>`;
    document.getElementById('coles-half-price-count').innerHTML = `<div class="tag-bind"><div class="tag-lead is-dark">Half-Price</div><div class="tag-tail is-cyan">${colesHalfPriceCount}</div></div>`;
    document.getElementById('woolworths-total-count').innerHTML = `<div class="tag-bind"><div class="tag-lead is-dark">Woolworths</div><div class="tag-tail is-blue">${woolworthsTotalCount}</div></div>`;
    document.getElementById('woolworths-half-price-count').innerHTML = `<div class="tag-bind"><div class="tag-lead is-dark">Half-Price</div><div class="tag-tail is-cyan">${woolworthsHalfPriceCount}</div></div>`;

    startScrollCheckInterval();
}).catch(error => {
    console.error('Error:', error);
});