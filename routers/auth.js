import express from 'express';
import User from '../models/User.js';
import connectToDatabase from '../db.js'; 
const router = express.Router();

export function checkAuth(req, res, next) {
    if (!req.session.user) {
      return res.send(`<script>alert('You must be logged in to book a flight'); window.location.href='/login';</script>`);
    }
    next();
  }
  


router.post('/submit-signup', async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send('Email already exists.');
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.send(`
            <html>
                <body>
                    <p>User registered with _id: ${newUser._id}</p>
                    <script>
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1000);
                    </script>
                </body>
            </html>
        `);

  } catch (error) {
    console.error('Error submitting signup:', error);
    res.status(500).send('Error occurred during sign-up');
  }
});

/*router.post('/submit-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      req.session.user = { email: user.email };
      res.redirect('/');
    } else {
      res.redirect('/login?error=Invalid email or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.redirect('/login?error=An error occurred during login');
  }
});*/

router.post('/submit-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, password });
  
      if (user) {
        req.session.user = { _id: user._id, email: user.email };
        res.redirect('/');
      } else {
        res.redirect('/login?error=Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.redirect('/login?error=An error occurred during login');
    }
  });





export default router;
