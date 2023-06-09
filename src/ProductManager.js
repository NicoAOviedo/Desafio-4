import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.loadProducts();
    this.id = this.calculateNextId();
  }

  addProduct(title, description, price, stock, thumbnails = []) {
    if (title && description && price && stock) {
      const id = this.id++;
      const newProduct = {
        id,
        title,
        description,
        price,
        stock,
        thumbnails,
        status: true,
        category: '',
        code: this.generateCode(),
      };
      this.products.push(newProduct);
      this.archiveProducts();
    } else {
      console.log('ERROR: Debe completar todos los campos');
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return;
    }
    this.products.splice(index, 1);
    this.archiveProducts();
  }

  updateProduct(id, newObject) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return;
    }
    const updatedProduct = {
      ...this.products[productIndex],
      ...newObject,
    };
    this.products[productIndex] = updatedProduct;
    this.archiveProducts();
  }

  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  generateCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomCode = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${timestamp}-${randomCode}`;
  }

  archiveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  loadProducts() {
    try {
      const fileContents = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(fileContents);
      this.id = this.calculateNextId();
    } catch (error) {
      console.log('No se pudo cargar el archivo de productos. Se creará uno nuevo.');
      this.archiveProducts();
    }
  }

  calculateNextId() {
    let maxId = 0;
    for (const product of this.products) {
      if (product.id > maxId) {
        maxId = product.id;
      }
    }
    return maxId + 1;
  }
}

export default ProductManager;