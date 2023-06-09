import fs from 'fs';

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.loadCarts();
    this.id = this.calculateNextId();
  }

  createCart(products = []) {
    const cartId = this.generateCartId();
    const newCart = {
      id: cartId,
      products: products.map((productId) => ({ productId, quantity: 1 })),
    };
    this.carts.push(newCart);
    this.archiveCarts();
    return newCart;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addToCart(cartId, productId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      return;
    }
    const existingItem = cart.products.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }
    this.archiveCarts();
  }

  removeFromCart(cartId, productId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      return;
    }
    const existingItemIndex = cart.products.findIndex((item) => item.productId === productId);
    if (existingItemIndex !== -1) {
      const existingItem = cart.products[existingItemIndex];
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        cart.products.splice(existingItemIndex, 1);
      }
      this.archiveCarts();
    }
  }

  getAllCarts() {
    return this.carts;
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.archiveCarts();
      } else {
        console.error(error);
      }
    }
  }

  archiveCarts() {
    try {
      const jsonData = JSON.stringify(this.carts);
      fs.writeFileSync(this.path, jsonData);
    } catch (error) {
      console.error(error);
    }
  }

  generateCartId() {
    const cartId = 'CART-' + this.id.toString().padStart(4, '0');
    this.id++;
    return cartId;
  }

  calculateNextId() {
    if (this.carts.length === 0) {
      return 1;
    } else {
      const maxId = this.carts.reduce((max, cart) => {
        const cartId = parseInt(cart.id.split('-')[1]);
        return cartId > max ? cartId : max;
      }, 0);
      return maxId + 1;
    }
  }
}

export default CartManager;