// Firebase SDK imports for Firebase v9+ (modular approach)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUduOP2eu1hhjNm9M7EKeBFPdy0CNHqwU",
    authDomain: "navinrolls-fzbilling.firebaseapp.com",
    databaseURL: "https://navinrolls-fzbilling-default-rtdb.firebaseio.com",
    projectId: "navinrolls-fzbilling",
    storageBucket: "navinrolls-fzbilling.firebasestorage.app",
    messagingSenderId: "133912915246",
    appId: "1:133912915246:web:12c27f3b8c33a8ced95ebf",
    measurementId: "G-S8M650XRYR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements for displaying menu items and categories
const menuContainer = document.getElementById('menu-container');
const dropdownContent = document.getElementById('dropdown-content');
const dropdownBtn = document.querySelector('.dropdown-btn');

// Load categories from Firebase
async function loadCategories() {
    const categoriesRef = ref(database, 'categories');
    try {
        const snapshot = await get(categoriesRef);
        const categories = snapshot.val();

        if (categories) {
            populateCategories(categories);
        } else {
            console.log("No categories available.");
        }
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Populate categories dropdown
function populateCategories(categories) {
    // Clear dropdown
    dropdownContent.innerHTML = '';

    // Add "All" option
    const allOption = document.createElement('a');
    allOption.textContent = 'All';
    allOption.href = '#';
    allOption.onclick = () => filterItemsByCategory('all');
    dropdownContent.appendChild(allOption);

    // Add other category options
    Object.keys(categories).forEach(category => {
        const option = document.createElement('a');
        option.textContent = categories[category]; // Category name as the value
        option.href = '#';
        option.onclick = () => filterItemsByCategory(category); // Use category as the key
        dropdownContent.appendChild(option);
    });
}

// Toggle dropdown visibility
function toggleDropdown() {
    dropdownContent.classList.toggle('show');
}

// Load menu items from Firebase
async function loadMenuItems() {
    const menuRef = ref(database, 'menu');
    try {
        const snapshot = await get(menuRef);
        const menuItems = snapshot.val();
        menuContainer.innerHTML = '';

        if (menuItems) {
            Object.keys(menuItems).forEach(key => {
                const item = menuItems[key];
                const menuItemCard = document.createElement('div');
                menuItemCard.classList.add('col-md-4', 'mb-4');
                menuItemCard.innerHTML = `
                    <div class="card menu-card">
                        <img src="${item.ImageURL}" class="card-img-top menu-card-img" alt="${item.DishName}">
                        <div class="card-body menu-card-body">
                            <h5 class="menu-card-title">${item.DishName}</h5>
                            <p class="menu-card-price">₹${item.Price}</p>
                            <p class="text-muted">${item.Category}</p>
                        </div>
                    </div>
                `;
                menuContainer.appendChild(menuItemCard);
            });
        } else {
            menuContainer.innerHTML = '<p class="text-center">No menu items available. Please check back later.</p>';
        }
    } catch (error) {
        console.error("Error loading menu items:", error);
    }
}

// Filter items by selected category
function filterItemsByCategory(categoryId) {
    const menuRef = ref(database, 'menu');
    get(menuRef).then(snapshot => {
        const menuItems = snapshot.val();
        menuContainer.innerHTML = '';

        if (menuItems) {
            Object.keys(menuItems).forEach(key => {
                const item = menuItems[key];
                if (categoryId === 'all' || item.Category === categoryId) {
                    const menuItemCard = document.createElement('div');
                    menuItemCard.classList.add('col-md-4', 'mb-4');
                    menuItemCard.innerHTML = `
                        <div class="card menu-card">
                            <img src="${item.ImageURL}" class="card-img-top menu-card-img" alt="${item.DishName}">
                            <div class="card-body menu-card-body">
                                <h5 class="menu-card-title">${item.DishName}</h5>
                                <p class="menu-card-price">₹${item.Price}</p>
                                <p class="text-muted">${item.Category}</p>
                                
                            </div>
                        </div>
                    `;
                    menuContainer.appendChild(menuItemCard);
                }
            });
        }
    });
}

// Load categories and menu items on page load
window.onload = function() {
    loadCategories();
    loadMenuItems();
};

// JavaScript for Load Button functionality
document.getElementById('load-btn').addEventListener('click', function() {
    location.reload();  // Reloads the page
});

// Event listener for toggling dropdown
dropdownBtn.addEventListener('click', toggleDropdown);