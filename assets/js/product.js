document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // ==================== QUICK VIEW MODAL ====================
    // Hàm mở modal xem nhanh
    function openQuickView(productCard) {
        const productData = {
            id: productCard.dataset.productId,
            title: productCard.querySelector('.product-title').textContent,
            currentPrice: productCard.querySelector('.current-price').textContent,
            oldPrice: productCard.querySelector('.old-price')?.textContent || '',
            image: productCard.querySelector('.product-image').src,
            author: productCard.dataset.author || 'Unknown',
            productCode: productCard.dataset.productCode || 'N/A',
            description: productCard.dataset.description || 'No description available',
        };

        const modal = document.querySelector('.quick-view-modal');
        modal.dataset.productId = productData.id;
        modal.querySelector('.main-image').src = productData.image;
        modal.querySelector('h2').textContent = productData.title;
        modal.querySelector('.current-price').textContent = productData.currentPrice;
        modal.querySelector('.old-price').textContent = productData.oldPrice;
        modal.querySelector('.brand span').textContent = productData.author;
        modal.querySelector('.sku span').textContent = productData.productCode;
        modal.querySelector('.description p').textContent = productData.description;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Sự kiện click nút Quick View
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            if (productCard) openQuickView(productCard);
        });
    });

    // Hàm đóng modal
    function closeModal() {
        document.querySelector('.quick-view-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Sự kiện đóng modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // ==================== QUẢN LÝ GIỎ HÀNG ====================
    // Hàm thêm sản phẩm vào giỏ
    function addToCart(productId, productName, price, image, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(price.replace(/[^0-9.]/g, '')), // Chuyển giá về số
                image: image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateHeaderCartCount();
        alert(`Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng.`);
    }

    // Cập nhật số lượng trên biểu tượng giỏ hàng
    function updateHeaderCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-icon-count').forEach(icon => {
            icon.textContent = totalItems;
        });
    }

    // Sự kiện thêm vào giỏ hàng từ modal
    document.querySelector('.actions .add-to-cart').addEventListener('click', function () {
        const qty = parseInt(document.querySelector('.qty-controls input').value);
        const modal = document.querySelector('.quick-view-modal');

        const productId = modal.dataset.productId;
        const productName = modal.querySelector('h2').textContent;
        const price = modal.querySelector('.current-price').textContent;
        const image = modal.querySelector('.main-image').src;

        if (productId && productName && qty > 0) {
            addToCart(productId, productName, price, image, qty);
        } else {
            alert('Thông tin sản phẩm không hợp lệ.');
        }

        closeModal();
    });

    // ==================== QUẢN LÝ SỐ LƯỢNG ====================
    const qtyInput = document.querySelector('.qty-controls input');
    document.querySelector('.qty-plus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.querySelector('.qty-minus').addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    // ==================== CHUYỂN ẢNH THUMBNAIL ====================
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function () {
            const newImage = this.getAttribute('data-image');
            const mainImg = document.querySelector('.main-image');

            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = newImage;
                mainImg.style.opacity = 1;
            }, 200);
        });
    });
});




// Hàm lọc sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    // Hàm lọc sản phẩm
    function filterProducts() {
        const activeCategory = document.querySelector('.filter-item.active[data-filter-type="category"]');
        const activePrice = document.querySelector('.filter-item.active[data-filter-type="price"]');
        
        const category = activeCategory ? activeCategory.dataset.value : 'all';
        const priceRange = activePrice ? activePrice.dataset.value : 'all';
        
        document.querySelectorAll('.product-card').forEach(product => {
            const productCategory = product.dataset.category;
            const productPrice = parseInt(product.dataset.price);
            
            // Kiểm tra danh mục
            const categoryMatch = category === 'all' || productCategory === category;
            
            // Kiểm tra khoảng giá
            let priceMatch = true;
            if (priceRange !== 'all') {
                const [min, max] = priceRange.split('-').map(Number);
                priceMatch = (min ? productPrice >= min : true) && 
                             (max ? productPrice <= max : true);
            }
            
            // Hiển thị với hiệu ứng mượt mà
            product.style.opacity = '0';
            product.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                product.style.display = categoryMatch && priceMatch ? 'block' : 'none';
                if (categoryMatch && priceMatch) {
                    setTimeout(() => {
                        product.style.opacity = '1';
                    }, 50);
                }
            }, 200);
        });
    }

    // Lọc theo danh mục
    document.querySelectorAll('.filter-item[data-filter-type="category"]').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.filter-item[data-filter-type="category"]').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            filterProducts();
        });
    });

    // Lọc theo giá
    document.querySelectorAll('.filter-item[data-filter-type="price"]').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.filter-item[data-filter-type="price"]').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            filterProducts();
        });
    });

    // Mở/đóng các nhóm lọc trên mobile (nếu có)
    document.querySelectorAll('.filter-title').forEach(title => {
        title.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.parentElement.classList.toggle('active');
            }
        });
    });

    // Áp dụng bộ lọc mặc định khi tải trang
    filterProducts();
});