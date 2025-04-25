document.addEventListener('DOMContentLoaded', function() {
    // Mở modal
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productData = {
                title: productCard.querySelector('.product-title').textContent,
                currentPrice: productCard.querySelector('.current-price').textContent,
                oldPrice: productCard.querySelector('.old-price').textContent,
                image: productCard.querySelector('.product-image').src
            };

            // Cập nhật modal
            document.querySelector('.quick-view-modal .main-image').src = productData.image;
            document.querySelector('.quick-view-modal h2').textContent = productData.title;
            document.querySelector('.quick-view-modal .current-price').textContent = productData.currentPrice;
            document.querySelector('.quick-view-modal .old-price').textContent = productData.oldPrice;

            // Hiển thị modal
            document.querySelector('.quick-view-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Đóng modal
    function closeModal() {
        document.querySelector('.quick-view-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Chuyển ảnh bằng thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
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

    // Tăng/giảm số lượng
    const qtyInput = document.querySelector('.qty-controls input');
    document.querySelector('.qty-plus').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.querySelector('.qty-minus').addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    // Thêm vào giỏ hàng
    document.querySelector('.actions .add-to-cart').addEventListener('click', function() {
        const qty = parseInt(document.querySelector('.qty-controls input').value);
        alert(`Added ${qty} items to cart`);
        closeModal();
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