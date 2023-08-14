const searchInput = document.getElementById('searchInput');
const productList = document.getElementById('productList');
const alternateProductList = document.getElementById('alternateProductList');
const productDetails = document.getElementById('productDetails');
const categoryFilter = document.getElementById('categoryFilter'); // Get category filter element

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Load products from JSON file
fetch('json/products.json')
  .then(response => response.json())
  .then(data => {
    const products = data;

    shuffleArray(products);

    // Display all products initially
    displayProductsAlternate(products);
    displayProductsByCategory(products);
    displayProductsAlternate(products);
    displayProducts(products);

    // Listen for search input changes
    // Listen for search input changes
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.detail && product.detail.toLowerCase().includes(searchTerm))
      );

      displayProducts(filteredProducts);

      // Generate search recommendations based on input
      const searchRecommendations = generateSearchRecommendations(searchTerm);
      displaySearchRecommendations(searchRecommendations);
    });

    // Function to generate search recommendations
    function generateSearchRecommendations(searchTerm) {
      // Filter products to find names that match the search term
      const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );

      // Extract unique words from matching product names
      const words = matchingProducts.flatMap(product =>
        product.name.toLowerCase().split(' ')
      );
      const uniqueWords = [...new Set(words)];

      return uniqueWords;
    }

    // Function to display search recommendations
    function displaySearchRecommendations(recommendations) {
      const recommendationList = document.getElementById('searchRecommendations');
      recommendationList.innerHTML = '';

      recommendations.forEach(recommendation => {
        const recommendationItem = document.createElement('li');
        recommendationItem.textContent = recommendation;
        recommendationItem.addEventListener('click', () => {
          searchInput.value = recommendation;
          recommendationList.innerHTML = ''; // Clear recommendations
          // Trigger search or other action here
        });
        recommendationList.appendChild(recommendationItem);
      });

      // Show/hide the recommendation list based on content
      if (recommendations.length > 0) {
        recommendationList.style.display = 'block';
      } else {
        recommendationList.style.display = 'none';
      }
    }

    // Listen for clicks outside the search input to clear recommendations
    document.addEventListener('click', (event) => {
      const targetElement = event.target;

      // Check if the click target is outside the search input
      if (!searchInput.contains(targetElement)) {
        clearSearchRecommendations();
      }
    });

    // Function to clear search recommendations
    function clearSearchRecommendations() {
      const recommendationList = document.getElementById('searchRecommendations');
      recommendationList.innerHTML = '';
    }



    // Listen for category filter changes
    categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      const filteredProducts = products.filter(product =>
        (!selectedCategory || product.category === selectedCategory)
      );

      displayProducts(filteredProducts);
    });

    // ...

    // Display products in their respective category sections
    function displayProductsByCategory(products) {
      const categoryContainers = {
        "beef": document.getElementById("beefProducts"),
        "seafood": document.getElementById("seafoodProducts")
        // Tambahkan kategori lainnya jika diperlukan
      };

      // Clear the existing content
      for (const containerId in categoryContainers) {
        categoryContainers[containerId].innerHTML = ``;
      }

      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const searchTerm = searchInput.value.toLowerCase();
          const selectedCategory = document.getElementById('categoryFilter').value;
          const filteredProducts = products.filter(product =>
            (product.name.toLowerCase().includes(searchTerm) ||
              (product.detail && product.detail.toLowerCase().includes(searchTerm))) &&
            (!selectedCategory || product.category === selectedCategory)
          );
      
          displayProducts(filteredProducts);
        }
      });
      

      // Populate category sections with products
      products.forEach(product => {
        if (categoryContainers[product.category]) {
          const productItem = document.createElement('div');
          productItem.classList.add('product-ctg');
          productItem.dataset.productId = product.name;
          productItem.innerHTML = `
          <div class="product-card-ctg">
          <img src="${product.image}" alt="${product.name}" class="product-image-ctg" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
          <h3 class="product-name-ctg">${product.name}</h3>
          <p class="product-info-ctg">${product.info}</p>
        </div>
        
          

        
          `;
          categoryContainers[product.category].appendChild(productItem);

          // Add a click event listener to each product item
          productItem.addEventListener('click', () => {
            const selectedProduct = products.find(p => p.name === productItem.dataset.productId);
            displayProductDetails(selectedProduct);
          });
        }
      });
    }

    // ...

    // Replace this line in your existing code
    displayProducts(products);

    // with
    displayProductsByCategory(products);


    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCategory = document.getElementById('categoryFilter').value; // Get selected category value
      const filteredProducts = products.filter(product =>
        (product.name.toLowerCase().includes(searchTerm) ||
          (product.detail && product.detail.toLowerCase().includes(searchTerm))) &&
        (!selectedCategory || product.category === selectedCategory) // Apply category filter
      );

      displayProducts(filteredProducts);
    });


    // Display product details
    productList.addEventListener('click', event => {
      const productItem = event.target.closest('.product-item');
      if (productItem) {
        const selectedProductId = productItem.dataset.productId;
        const selectedProduct = products.find(product => product.name === selectedProductId);
        displayProductDetails(selectedProduct);
      }
    });
  });



// Display list of products
function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.dataset.productId = product.name;
    productItem.innerHTML = `
            <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.category}</p>
            </div>
        `;
    productList.appendChild(productItem);
  });
}

// ...

// Display list of products with different class
function displayProductsAlternate(products) {
  alternateProductList.innerHTML = '';

  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('alternate-product-item');
    productItem.dataset.productId = product.name;
    productItem.innerHTML = `
          <div class="alternate-product-card">
              <img src="${product.image}" alt="${product.name}" class="alternate-product-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
              <h2 class="alternate-product-category">${product.category}</h2>
              <div class"alternate-product-dit">
              <h3 class="alternate-product-name">${product.name}</h3>
              <p class="alternate-product-info">${product.info}</p>
          </div>
          </div>
      `;
    alternateProductList.appendChild(productItem);

    // Add a click event listener to each alternate product item
    productItem.addEventListener('click', () => {
      const selectedProduct = products.find(p => p.name === productItem.dataset.productId);
      displayProductDetails(selectedProduct);
    });
  });
}

// ...

// Call the loadProducts function when the page is loaded
window.addEventListener('load', loadProducts);



// Display product details
function displayProductDetails(product) {
  productDetails.innerHTML = `
        <div class="container-details">
        <div class="con-details">
        <div class="header-details">
        <div id="closeButton" class="left">
            <a href="#"><i class="fas fa-chevron-left"></i> Kembali</a>
          </div>
          <div class="right">
            <a href="#"><i class="fas fa-ellipsis-h"></i></a>
          </div>
        </div>


        <div class="product-details-new">
        <div class="product-details-image-new">
          <div class="image-ratio">
            <div class="ratio-inner">
            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
            </div>
          </div>
        </div>
      </div>


        <div class="product-details-container">
          <button id="closeButton" class="play-button"><i class="fa-solid fa-play"></i> Play Videos</button>
          <h1 class="product-details-name">${product.name}</h1>
          <p class="product-details-price">$${product.price}</p>
          <p class="product-details-info">${product.detail || product.info || ''}</p>
          <p class="product-details-offer">${product.offer || ''}</p>

          <div class="recipe-info">
            <span>Persiapan: 30 Menit</span>
            <span> Kesulitan: Mudah</span>
          </div>
          <div class="ingredients">
            <h2>Bahan-bahan:</h2>
            <ul>
              ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
          <div class="instructions">
            <h2>Cara Memasak:</h2>
            <ol>
              ${product.cooking_instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
        </div>
        </div>
      `;

  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    productDetails.innerHTML = '';
  });
}