import  ProductManager from './ProductManager.js'

const productsUpdated = async (io) => {
    const productManager = new ProductManager('./productos.json')
    const products = await productManager.getProducts()
    io.emit('productsUpdated' , products)
}

export {productsUpdated}