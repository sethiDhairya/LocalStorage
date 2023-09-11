// Initialize data from localStorage or use an empty array
let data = JSON.parse(localStorage.getItem('products')) || [];
let editMode = false; // New variable to track edit mode

document.addEventListener("DOMContentLoaded", function () {
    const showProductBtn = document.getElementById("showProductBtn");
    const addProductBtn = document.getElementById("addProductBtn");
    const productForm = document.getElementById("productForm");
    const data_table = document.querySelector(".data_table");

    showProductBtn.addEventListener("click", readAll);
    addProductBtn.addEventListener("click", showAddProductForm);
    productForm.addEventListener("submit", handleSubmit);

    function showAddProductForm() {
        document.querySelector(".create_form").style.display = "block";
        productForm.reset();
        editMode = false; // Set to false when adding a new product
    }

    function addProduct(id, name, quantity, price) {
        const newProduct = { id, name, quantity, price };
        data.push(newProduct);
        saveToLocalStorage(data);
        readAll();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("productName").value;
        const quantity = parseInt(document.getElementById("productQuantity").value);
        const price = parseFloat(document.getElementById("productPrice").value);

        if (name && !isNaN(quantity) && !isNaN(price)) {
            if (editMode) {
                const id = parseInt(document.getElementById("productId").value);
                updateProduct(id, name, quantity, price);
                editMode = false; // Exit edit mode
            } else {
                const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
                addProduct(id, name, quantity, price);
            }

            productForm.reset();
            document.querySelector(".create_form").style.display = "none";
        }
    }

    function readAll() {
        const objectdata = getDataFromLocalStorage();
        let elements = "";

        objectdata.forEach(record => {
            elements += `
                <tr>
                    <td>${record.name}</td>
                    <td>${record.quantity}</td>
                    <td>${record.price}</td>
                    <td><button class="edit" data-id="${record.id}">Edit</button></td>
                    <td><button class="delete" data-id="${record.id}">Delete</button></td>
                </tr>`;
        });

        data_table.innerHTML = elements;

        // Add event listeners for delete using event delegation
        data_table.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        // Add event listeners for edit using event delegation
        data_table.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
    }

    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const productIndex = data.findIndex(rec => rec.id === id);
    
        if (productIndex !== -1) {
            const productNameInput = document.getElementById("productName");
            const productQuantityInput = document.getElementById("productQuantity");
            const productPriceInput = document.getElementById("productPrice");
    
            if (productNameInput && productQuantityInput && productPriceInput) {
                const updatedName = productNameInput.value;
                const updatedQuantity = parseInt(productQuantityInput.value);
                const updatedPrice = parseFloat(productPriceInput.value);
    
                if (updatedName && !isNaN(updatedQuantity) && !isNaN(updatedPrice)) {
                    // Update the product in the data array
                    data[productIndex].name = updatedName;
                    data[productIndex].quantity = updatedQuantity;
                    data[productIndex].price = updatedPrice;
                    saveToLocalStorage(data);
    
                    // Clear the form and exit edit mode
                    productNameInput.value = "";
                    productQuantityInput.value = "";
                    productPriceInput.value = "";
                    editMode = false;
    
                    // Refresh the product list
                    readAll();
                } else {
                    console.error("Invalid input for editing product.");
                }
            } else {
                console.error("One or more form elements not found.");
            }
        }
    }
    

    function handleDelete(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        data = data.filter(rec => rec.id !== id);
        saveToLocalStorage(data);
        readAll();
    }

    function updateProduct(id, name, quantity, price) {
        const index = data.findIndex(rec => rec.id === id);
        if (index !== -1) {
            data[index] = { id, name, quantity, price };
            saveToLocalStorage(data);
            readAll();
        }
    }

    function saveToLocalStorage(data) {
        localStorage.setItem("products", JSON.stringify(data));
    }

    function getDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    // Initialize the page by reading existing data from localStorage
    readAll();
});
