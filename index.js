import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRouter from './routers/auth.js';
import flightsRouter from './routers/flights.js';
import connectToDatabase from './db.js';
import { checkAuth } from './routers/auth.js'; // Import the middleware

const app = express();

// ✅ Use Render PORT (fallback to 3001 locally)
const port = process.env.PORT || 3001;

// ✅ Razorpay test keys (hardcoded for now)
const key_id = 'rzp_test_xqURUfFox64Iw6';
const key_secret = 'UlcCoi5F2RF3UjmZql6eRJtT';

const razorpayInstance = new Razorpay({
  key_id,
  key_secret,
});

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// ✅ Session (MemoryStore is fine for testing, not production-ready)
app.use(session({
  secret: 'my-secret-key', // Hardcoded
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ✅ Add user info to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ✅ Razorpay routes
app.post('/api/payment/order', (req, res) => {
  const { amount, currency } = req.body;
  razorpayInstance.orders.create({ amount, currency }, (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(order);
  });
});

app.post('/api/payment/verify', (req, res) => {
  const { order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto.createHmac('sha256', key_secret)
    .update(order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified ✅' });
  } else {
    res.json({ success: false, message: 'Payment verification failed ❌' });
  }
});

// ✅ Routes
app.get('/', (req, res) => res.render('home'));
app.get('/orders', (req, res) => res.render('order'));
app.use('/', authRouter);
app.use('/', flightsRouter);

app.get('/book', checkAuth, (req, res) => {
  const flightData = JSON.parse(decodeURIComponent(req.query.flightData));
  res.render('booking', { flightData });
});

app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.get('/track', (req, res) => res.render('track'));
app.get('/admin', (req, res) => res.render('admin'));

// ✅ Connect to DB & start server
connectToDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error starting server:', error);
  });
