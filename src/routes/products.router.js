import express from 'express';
import { productsUpdated } from '../socketUtils.js'

function productsRouter(productManager, io) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
  });

  router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.sendStatus(404);
    }
  });

  router.post('/', (req, res) => {
    const { title, description, price, stock, thumbnails } = req.body;
    productManager.addProduct(title, description, price, stock, thumbnails);
    res.sendStatus(201);
    productsUpdated(req.app.get('io'))
    io.emit('productListUpdated', productManager.getProducts());
  });

  router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, description, price, stock, thumbnails } = req.body;
    productManager.updateProduct(productId, { title, description, price, stock, thumbnails });
    productsUpdated(req.app.get('io'))
    res.sendStatus(200);
    io.emit('productListUpdated', productManager.getProducts());
  });

  router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    productManager.deleteProduct(productId);
    res.sendStatus(200);
    productsUpdated(req.app.get('io'))
    io.emit('productListUpdated', productManager.getProducts());
  });

  return router;
}

export default productsRouter;