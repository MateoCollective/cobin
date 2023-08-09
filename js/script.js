const searchInput = document.getElementById('searchInput');
const productList = document.getElementById('productList');
const productDetails = document.getElementById('productDetails');
const categoryFilter = document.getElementById('categoryFilter'); // Get category filter element


// Load products from JSON file
fetch('json/products.json')
    .then(response => response.json())
    .then(data => {
        const products = data;

        // Display all products initially
        displayProductsAlternate(products);
        displayProducts(products);

        // Listen for search input changes
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                (product.detail && product.detail.toLowerCase().includes(searchTerm))
            );

            displayProducts(filteredProducts);
        });

        
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
      "kategori1": document.getElementById("kategori1Products")
      // Tambahkan kategori lainnya jika diperlukan
  };

  // Clear the existing content
  for (const containerId in categoryContainers) {
      categoryContainers[containerId].innerHTML = ``;
  }

  // Populate category sections with products
  products.forEach(product => {
      if (categoryContainers[product.category]) {
          const productItem = document.createElement('div');
          productItem.classList.add('product-ctg');
          productItem.dataset.productId = product.name;
          productItem.innerHTML = `
          <div class="product-card-ctg">
          <img src="${product.image}" alt="${product.name}" class="product-image-ctg">
          <h3 class="product-name-ctg">${product.name}</h3>
          <p class="product-price-ctg">$${product.price}</p>
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
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

// Display list of products with different class
function displayProductsAlternate(products) {
    const alternateProductList = document.getElementById('alternateProductList');
    alternateProductList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('alternate-product-item'); // Menambahkan class berbeda
        productItem.dataset.productId = product.name;
        productItem.innerHTML = `
            <div class="alternate-product-card"> <!-- Menggunakan class berbeda -->
            <img src="${product.image}" alt="${product.name}" class="alternate-product-image"> <!-- Menggunakan class berbeda -->
            <h3 class="alternate-product-name">${product.name}</h3> <!-- Menggunakan class berbeda -->
            <p class="alternate-product-price">$${product.price}</p> <!-- Menggunakan class berbeda -->
            </div>
        `;
        alternateProductList.appendChild(productItem);
    });
}


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
            <img src="${product.image}" alt="${product.name}">
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
              <!-- Loop through the ingredients array -->
              ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
          </div>
          <div class="instructions">
            <h2>Cara Memasak:</h2>
            <ol>
              <!-- Loop through the cooking_instructions array -->
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

// ...

// Function to shuffle (randomize) an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Display list of products with shuffled order
function displayShuffledProducts(products) {
    const shuffledProducts = shuffleArray([...products]);
    productList.innerHTML = '';
    shuffledProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.dataset.productId = product.name;
        productItem.innerHTML = `
            <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

// ...

// Call the shuffled display function when the page is loaded
window.addEventListener('load', () => {
    fetch('json/products.json')
        .then(response => response.json())
        .then(data => {
            const products = data;
            displayShuffledProducts(products);
            // ...
        });
});

// Function to shuffle (randomize) an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Display list of products with different class and shuffled order
function displayShuffledAlternateProducts(products) {
  const alternateProductList = document.getElementById('alternateProductList');
  const shuffledProducts = shuffleArray([...products]);
  alternateProductList.innerHTML = '';
  
  shuffledProducts.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('alternate-product-item'); // Menambahkan class berbeda
      productItem.dataset.productId = product.name;
      productItem.innerHTML = `
          <div class="alternate-product-card"> <!-- Menggunakan class berbeda -->
          <img src="${product.image}" alt="${product.name}" class="alternate-product-image"> <!-- Menggunakan class berbeda -->
          <h3 class="alternate-product-name">${product.name}</h3> <!-- Menggunakan class berbeda -->
          <p class="alternate-product-price">$${product.price}</p> <!-- Menggunakan class berbeda -->
          </div>
      `;
      alternateProductList.appendChild(productItem);
  });
}

// Panggil fungsi untuk menampilkan daftar produk dengan class berbeda yang diacak saat halaman dimuat
window.addEventListener('load', () => {
  fetch('json/products.json')
      .then(response => response.json())
      .then(data => {
          const products = data;
          displayShuffledAlternateProducts(products);

          // ... Kode lainnya seperti yang Anda berikan sebelumnya ...

      });
});


// ...


