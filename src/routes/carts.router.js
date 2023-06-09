import express from 'express';

function createCartsRouter(cartManager, io) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const cart = cartManager.createCart([]);
    res.status(201).json({ id: cart.id, message: 'Carrito creado!' });
  });

  router.get('/', (req, res) => {
    const carts = cartManager.getAllCarts();
    res.json(carts);
  });

  router.get('/:id', (req, res) => {
    const cartId = req.params.id;
    const cart = cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'No se encuentra el Carrito' });
    }
  });

  router.post('/:id/products/:productId', (req, res) => {
    const cartId = req.params.id;
    const productId = parseInt(req.params.productId);
    cartManager.addToCart(cartId, productId);
    res.sendStatus(200);
    io.emit('cartUpdated', cartManager.getCartById(cartId));
  });

  router.delete('/:id/products/:productId', (req, res) => {
    const cartId = req.params.id;
    const productId = parseInt(req.params.productId);
    cartManager.removeFromCart(cartId, productId);
    res.sendStatus(200);
    io.emit('cartUpdated', cartManager.getCartById(cartId));
  });

  return router;
}

export default createCartsRouter;