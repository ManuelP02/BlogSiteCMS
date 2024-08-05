// Server things
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const path = require('path');
const { isLoggedIn, isLoggedOut, loadUser } = require('./auth/auth');
const sequelize = require('./config/connection');
const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

// Session middleware configuration
app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new SequelizeStore({
        db: sequelize,
    }),
}));

// Load user middleware
app.use(loadUser);

// Set up Handlebars with custom helpers
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        formatDate: function(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Server static files
app.use(express.static(path.join(__dirname, 'public')));

// Data parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Root route
app.get('/', isLoggedOut, (req, res) => {
    res.redirect('/login');
});

// Sync Sequelize and start the server
    sequelize.sync({ force: false }).then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
