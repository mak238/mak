// === Swiper Initialization ===
const swiper1 = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiper2 = new Swiper(".myswiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// === Mobile Navigation Toggle ===
const navlist = document.querySelector('.navlist');
const menu = document.querySelector('.fa-bars');

if (menu && navlist) {
  menu.addEventListener('click', () => {
    navlist.classList.toggle('active');
    menu.classList.toggle('fa-xmark');
  });
}

// === Product Catalog Data ===
const productCatalog = {
  "arcsaber-11": { name: "Arcsaber 11", price: 989 },
  "arc7p": { name: "Arc 7 Pro", price: 889 },
  "nanoflare170": { name: "Nanoflare 170", price: 899 },
  "nanoflare800": { name: "Nanoflare 800", price: 699 },
  "700pro": { name: "700 Pro", price: 1000 },
  "nanoflex700": { name: "Nanoflex 700", price: 666 },
  "astrox100zz": { name: "Astrox 100zz", price: 1200 },
  "astrox77pro": { name: "Astrox 77pro", price: 1099 },
  "astrox88Dpro": { name: "Astrox 88Dpro", price: 1100 },
};

// === Cart System ===
const cartKey = 'cart';
const cartCountElem = document.getElementById('cart-count');

// Load cart from localStorage
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || {};
  } catch {
    return {};
  }
};

// Save cart to localStorage
const saveCart = cart => {
  localStorage.setItem(cartKey, JSON.stringify(cart));
};

// Update cart icon count
const updateCartCount = () => {
  const cart = loadCart();
  const totalCount = Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0);
  if (cartCountElem) cartCountElem.textContent = totalCount;
};

// Add item to cart
const addToCart = ({ id, name, price }) => {
  const cart = loadCart();
  cart[id] = cart[id]
    ? { ...cart[id], quantity: (cart[id].quantity || 0) + 1 }
    : { id, name, price, quantity: 1 };

  saveCart(cart);
  updateCartCount();

  console.log("Product added:", { id, name, price });
  console.table(cart);

  alert(`${name} has been added to the cart!`);
};

// Extract product info from DOM
const extractProductInfo = button => {
  const row = button.closest('.racquets-row');
  const name = row?.querySelector('h3')?.textContent.trim() || 'Unnamed';
  const priceText = row?.querySelector('.racquets-icon p')?.textContent || '0';
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  return {
    id: button.dataset.productId || name.toLowerCase().replace(/\s+/g, '-'),
    name,
    price,
  };
};

// Setup event listeners for Add to Cart buttons
const setupAddToCart = () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const product = extractProductInfo(button);
      addToCart(product);
    });
  });
};

// Show cart contents
const showCart = () => {
  const cart = loadCart();
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const lines = Object.values(cart).map(item =>
    `${item.name} × ${item.quantity} = RM${(item.price * item.quantity).toFixed(2)}`
  );
  const total = Object.values(cart).reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  alert(`Cart Contents:\n${lines.join('\n')}\nTotal: RM${total.toFixed(2)}`);
};

// Clear cart logic
const setupClearCart = () => {
  const clearCartButton = document.getElementById('clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      localStorage.removeItem(cartKey);
      updateCartCount();
      alert('Cart has been cleared.');
    });
  }
};

// Page Load Handlers
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupAddToCart();
  setupClearCart();

  document.getElementById('cart-icon')?.addEventListener('click', showCart);

  // Payment popup logic
  const productButton = document.querySelector(".productButton");
  const payment = document.querySelector(".payment");
  const close = document.querySelector(".close");

  if (productButton && payment && close) {
    productButton.addEventListener("click", () => {
      payment.classList.add('active');
    });

    close.addEventListener("click", () => {
      payment.classList.remove('active');
    });
  }


  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      const cart = loadCart();
      const cartDataField = document.getElementById("cart-data");
      if (cartDataField) {
        cartDataField.value = JSON.stringify(cart);
      }
      localStorage.removeItem(cartKey); 
      updateCartCount();
      alert("Thank you for your purchase! Your cart has been cleared.");
    });
  }

  // Show the payment popup
  window.openPayment = function () {
    document.getElementById('paymentPopup').style.display = 'block';
  };

  // Hide the payment popup
  document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('paymentPopup').style.display = 'none';
  });
});

// Quick Order Function
function orderProductAndOpenPayment(productId) {
  const product = productCatalog[productId];
  if (product) {
    addToCart({ id: productId, ...product });
  }
  openPayment();
}

// Search Input Feature
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".fa-search");
  const searchInput = document.getElementById("searchInput");

  // Toggle input field on search icon click
  searchIcon.addEventListener("click", () => {
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
      searchInput.style.display = "inline-block";
      searchInput.focus();
    } else {
      searchInput.style.display = "none";
    }
  });

  // Perform search on every input (real-time)
  searchInput.addEventListener("input", () => {
    performSearch(searchInput.value);
  });

  // Press Enter key to perform search
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch(searchInput.value);
    }
  });
});

function performSearch(query) {
  const cards = document.querySelectorAll('.card'); 
  const lowerQuery = query.toLowerCase();
  let found = false;

  // If empty, show all cards
  if (lowerQuery.trim() === "") {
    cards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // Otherwise, filter
  cards.forEach(card => {
    const title = card.querySelector('.card-title'); 
    if (title && title.textContent.toLowerCase().includes(lowerQuery)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}