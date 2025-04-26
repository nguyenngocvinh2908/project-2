// cart-manager.js
class CartManager {
    constructor() {
        this.initCart();
        this.initEvents();
        this.updateCartUI();
    }

    initCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    initEvents() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.cart = JSON.parse(e.newValue || '[]');
                this.updateCartUI();
            }
        });

        // Listen for custom cart update events
        window.addEventListener('cartUpdated', () => {
            this.initCart();
            this.updateCartUI();
        });
    }

    // Public methods
    getCart() {
        return [...this.cart]; // Return a copy to prevent direct modification
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showNotification(product.name);
    }

    updateItem(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Helper methods
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartUI();
        window.dispatchEvent(new Event('cartUpdated'));
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        const subtotal = this.getSubtotal();
        return subtotal > 500000 ? 0 : 30000;
    }

    getTotal() {
        return this.getSubtotal() + this.calculateShipping();
    }

    // UI Updates
    updateCartUI() {
        this.updateCartIcon();
        
        if (typeof this.updateCartPage === 'function') {
            this.updateCartPage();
        }
    }

    updateCartIcon() {
        const totalItems = this.getTotalItems();
        document.querySelectorAll('.cart-icon-count').forEach(icon => {
            icon.textContent = totalItems;
            icon.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showNotification(productName) {
        const modal = document.createElement('div');
        modal.className = 'added-to-cart-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Đã thêm "${productName}" vào giỏ hàng!</p>
                <div class="modal-actions">
                    <button class="btn continue-btn">Tiếp tục mua sắm</button>
                    <a href="cart.html" class="btn view-cart-btn">Xem giỏ hàng</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.continue-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 3000);
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}

// Initialize global cart manager
window.cartManager = new CartManager();

// Update UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager.updateCartUI();
});