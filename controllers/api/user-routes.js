const router = require('express').Router();
const { User } = require('../../models');
const { isLoggedIn, isLoggedOut } = require('../../auth/auth');

//Signup render view route
router.get('/signup', isLoggedOut, (req, res) => {
  res.render('signup', {
    layout: 'main',
    currentPath: req.path
  });
});
//Login render view route
router.get('/login', (req, res) => {
  res.render('login', {
      layout: 'main',
      currentPath: req.path
  });
});

//Signup post route
router.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already in use' });
    }

    // If username doesn't exist, create new user
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    // Set up session
    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;  
      res.status(200).json({ success: true, message: 'User created successfully, going to home page!', redirectUrl: '/home' });
    });

  } catch (err) {
    console.error('Error in user creation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//Login post route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const dbUserData = await User.findOne({ where: { username } });

    if (!dbUserData) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    const validPassword = await dbUserData.checkPassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    req.session.userId = dbUserData.id;
    req.session.loggedIn = true;

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        } else {
          console.log('Session saved successfully:', req.session);
          resolve();
        }
      });
    });

    const { password: _, ...userWithoutPassword } = dbUserData.get({ plain: true });
    res.status(200).json({ user: userWithoutPassword, message: 'You are now logged in!', redirectUrl: '/home' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'An error occurred during login', error: err.message });
  }
});


//Logout route
router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.redirect('/login');
  });
});



  module.exports = router;