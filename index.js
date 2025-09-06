import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';
import flightsRouter from './routers/flights.js';
import connectToDatabase from './db.js';
import Flight from './models/Flight.js';
import { checkAuth } from './routers/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Razorpay instance (keys from .env)
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'key-bro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ✅ Routes
app.post('/api/payment/order', (req, res) => {
  const { amount, currency } = req.body;
  instance.orders.create({ amount, currency }, (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(order);
  });
});

app.post('/api/payment/verify', (req, res) => {
  const { order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: 'Payment is successful and verified.' });
  } else {
    res.json({ success: false, message: 'Payment verification failed.' });
  }
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/orders', (req, res) => {
  res.render('order');
});

app.use('/', authRouter);
app.use('/', flightsRouter);

app.get('/book', checkAuth, (req, res) => {
  const flightData = JSON.parse(decodeURIComponent(req.query.flightData));
  res.render('booking', { flightData });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.get('/track', (req, res) => {
  res.render('track');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

// ✅ Connect to MongoDB & Start Server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error starting server:', error);
  });
