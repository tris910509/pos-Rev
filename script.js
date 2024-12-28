// Inisialisasi Data
function initData() {
    if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify([]));
    if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify([]));
    if (!localStorage.getItem('suppliers')) localStorage.setItem('suppliers', JSON.stringify([]));
    if (!localStorage.getItem('transactions')) localStorage.setItem('transactions', JSON.stringify([]));
}
initData();

// Utility
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Kategori
function addCategory() {
    const name = document.getElementById('categoryName').value;
    if (!name) return alert('Nama kategori tidak boleh kosong');
    const categories = getFromLocalStorage('categories');
    categories.push({ id: `CAT-${Date.now()}`, name });
    saveToLocalStorage('categories', categories);
    displayCategories();
    document.getElementById('categoryForm').reset();
}

function displayCategories() {
    const categories = getFromLocalStorage('categories');
    document.getElementById('categoryList').innerHTML = categories.map(cat =>
        `<div>${cat.name}</div>`
    ).join('');
    populateProductCategories();
}

// Produk
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const categoryId = document.getElementById('productCategory').value;
    if (!name || !price || !stock || !categoryId) return alert('Semua field wajib diisi');

    const products = getFromLocalStorage('products');
    products.push({ id: `PROD-${Date.now()}`, name, price, stock, categoryId });
    saveToLocalStorage('products', products);
    displayProducts();
    document.getElementById('productForm').reset();
}

function displayProducts() {
    const products = getFromLocalStorage('products');
    document.getElementById('productList').innerHTML = products.map(prod =>
        `<div>${prod.name} - Rp${prod.price} - Stok: ${prod.stock}</div>`
    ).join('');
    populateTransactionProducts();
}

function populateProductCategories() {
    const categories = getFromLocalStorage('categories');
    const productCategory = document.getElementById('productCategory');
    productCategory.innerHTML = '<option value="">Pilih Kategori</option>';
    categories.forEach(cat => {
        productCategory.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
}

// Supplier
function addSupplier() {
    const name = document.getElementById('supplierName').value;
    const company = document.getElementById('supplierCompany').value;
    const phone = document.getElementById('supplierPhone').value;
    const address = document.getElementById('supplierAddress').value;
    if (!name || !company || !phone || !address) return alert('Semua field wajib diisi');

    const suppliers = getFromLocalStorage('suppliers');
    suppliers.push({ id: `SUP-${Date.now()}`, name, company, phone, address });
    saveToLocalStorage('suppliers', suppliers);
    displaySuppliers();
    document.getElementById('supplierForm').reset();
}

function displaySuppliers() {
    const suppliers = getFromLocalStorage('suppliers');
    document.getElementById('supplierList').innerHTML = suppliers.map(sup =>
        `<div>${sup.name} - ${sup.company}</div>`
    ).join('');
}

// Transaksi
function addTransaction() {
    const productId = document.getElementById('transactionProduct').value;
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const payment = parseFloat(document.getElementById('transactionPayment').value);
    const method = document.getElementById('paymentMethod').value;

    const products = getFromLocalStorage('products');
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < quantity) return alert('Stok tidak mencukupi');

    const total = product.price * quantity;
    const status = payment >= total ? 'Lunas' : 'Belum Lunas';
    const change = payment > total ? payment - total : 0;

    product.stock -= quantity;
    saveToLocalStorage('products', products);

    const transactions = getFromLocalStorage('transactions');
    transactions.push({ id: `TRANS-${Date.now()}`, product: product.name, quantity, total, payment, method, status, change });
    saveToLocalStorage('transactions', transactions);
    displayTransactions();
    displayProducts();
}

function displayTransactions() {
    const transactions = getFromLocalStorage('transactions');
    document.getElementById('transactionList').innerHTML = transactions.map(trans =>
        `<div>${trans.product} - Total: Rp${trans.total} - ${trans.status}</div>`
    ).join('');
}

// Load Data on Page Load
displayCategories();
displayProducts();
displaySuppliers();
displayTransactions();
