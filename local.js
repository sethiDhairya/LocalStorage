// Initialize data from localStorage or use an empty array
let data = JSON.parse(localStorage.getItem('products')) || [];

document.addEventListener("DOMContentLoaded", function () {
    const showProductBtn = document.getElementById("showProductBtn");
    const addProductBtn = document.getElementById("addProductBtn");
    const productForm = document.getElementById("productForm");
    const data_table = document.querySelector(".data_table");

    showProductBtn.addEventListener("click", function () {
        readAll();
    });

    addProductBtn.addEventListener("click", function () {
        document.querySelector(".create_form").style.display = "block";
        document.querySelector("#productForm").reset(); // Reset form fields
        productForm.removeEventListener("submit", updateProduct); // Remove the "updateProduct" event listener
        productForm.addEventListener("submit", addNewProduct); // Add the "addNewProduct" event listener
    });

    productForm.addEventListener("submit", addNewProduct);

    function addNewProduct(e) {
        e.preventDefault();
        const name = document.getElementById("productName").value;
        const quantity = parseInt(document.getElementById("productQuantity").value);
        const price = parseFloat(document.getElementById("productPrice").value);

        if (name && !isNaN(quantity) && !isNaN(price)) {
            const id = data.length + 1;
            addProduct(id, name, quantity, price);
            productForm.reset();
            document.querySelector(".create_form").style.display = "none";
        }
    }

    function addProduct(id, name, quantity, price) {
        const newProduct = { id, name, quantity, price };
        data.push(newProduct);
        saveToLocalStorage(data);
        readAll();
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
                    <td><button class="edit" onclick="edit(${record.id})">Edit</button></td>
                    <td><button class="delete" onclick="deleteProduct(${record.id})">Delete</button></td>
                </tr>`;
        });

        data_table.innerHTML = elements;
    }

    function deleteProduct(id) {
        data = data.filter(rec => rec.id !== id);
        saveToLocalStorage(data);
        readAll();
    }

    function edit(id) {
        const obj = data.find(rec => rec.id === id);
        document.getElementById("productName").value = obj.name;
        document.getElementById("productQuantity").value = obj.quantity;
        document.getElementById("productPrice").value = obj.price;

        // Change the form's submit event to updateProduct
        productForm.removeEventListener("submit", addNewProduct);
        productForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("productName").value;
            const quantity = parseInt(document.getElementById("productQuantity").value);
            const price = parseFloat(document.getElementById("productPrice").value);

            if (name && !isNaN(quantity) && !isNaN(price)) {
                updateProduct(id, name, quantity, price);
                productForm.reset();
                document.querySelector(".create_form").style.display = "none";
            }
        });
    }

    function updateProduct(id, name, quantity, price) {
        const index = data.findIndex(rec => rec.id === id);
        data[index] = { id, name, quantity, price };
        saveToLocalStorage(data);
        readAll();
    }

    function saveToLocalStorage(data) {
        localStorage.setItem("products", JSON.stringify(data));
    }

    function getDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }
});
