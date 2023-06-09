import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carritos.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('io', io )

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter(productManager, io));
app.use('/api/carts', cartsRouter(cartManager, io));

app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

function sendProductList() {
  const products = productManager.getProducts();
  io.emit('productListUpdated', products);
}

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('productCreated', (product) => {
    productManager.addProduct(product.title, product.description, product.price, product.stock);
    sendProductList();
  });

  socket.on('productDeleted', (productId) => {
    productManager.deleteProduct(productId);
    sendProductList();
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});