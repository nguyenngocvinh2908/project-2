// cart.js
document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const isCartPage = document.querySelector('.cart-container');

    // Hàm định dạng tiền tệ
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2, // Hiển thị 2 số thập phân
            maximumFractionDigits: 2
        }).format(price);
    }

    // Hàm cập nhật toàn bộ
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        if (isCartPage) displayCart();
        updateHeaderCartCount();
        window.dispatchEvent(new Event('cartUpdated'));
    }

    // Hàm hiển thị giỏ hàng (cho trang cart.html)
    function displayCart() {
        if (!isCartPage) return;
        
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            updateTotals(0, 0);
            return;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-price">${formatPrice(item.price)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="item-total">${formatPrice(itemTotal)}</div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals(subtotal, calculateShipping(subtotal));
    }

    // Hàm cập nhật tổng tiền
    function updateTotals(subtotal, shipping) {
        const total = subtotal + shipping;
        document.querySelector('.subtotal').textContent = formatPrice(subtotal);
        document.querySelector('.shipping').textContent = formatPrice(shipping);
        document.querySelector('.total-price').textContent = formatPrice(total);
    }

    // Tính phí vận chuyển
    function calculateShipping(subtotal) {
        // Miễn phí ship từ $500, dưới $500 tính $3 phí
        return subtotal >= 500 ? 0 : 3; 
    }

    // Hàm cập nhật số lượng trên icon
    function updateHeaderCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-icon-count').forEach(icon => {
            icon.textContent = totalItems;
        });
    }

    // Hàm thêm sản phẩm
    function addToCart(productId, productName, price, image, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: price,
                image: image,
                quantity: quantity
            });
        }
        
        updateCart();
        showAddedToCartModal(productName);
    }

    // Xử lý sự kiện click toàn trang
    document.addEventListener('click', function(e) {
        // Xử lý thêm vào giỏ hàng
        if (e.target.closest('.add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId || Date.now().toString();
            const productName = productCard.querySelector('.product-title')?.textContent || 'Sản phẩm';
            const priceText = productCard.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Giữ lại dấu thập phân
            const image = productCard.querySelector('.product-image')?.src || '';

            addToCart(productId, productName, price, image);
        }

        // Xử lý tăng/giảm số lượng
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const productId = btn.dataset.id;
            const item = cart.find(item => item.id === productId);

            if (btn.classList.contains('minus')) {
                item.quantity > 1 ? item.quantity-- : cart.splice(cart.indexOf(item), 1);
            } else {
                item.quantity++;
            }
            updateCart();
        }

        // Xử lý xóa sản phẩm
        if (e.target.closest('.remove-item')) {
            const productId = e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }
    });

    // Khởi tạo ban đầu
    updateHeaderCartCount();
    if (isCartPage) displayCart();
});