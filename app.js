const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

// Setarea motorului de vizualizare EJS.
app.set('view engine', 'ejs');

// Adauga middleware pentru a analiza datele din cereri și a face disponibile obiectele req.body.
app.use(express.urlencoded({ extended: true }));

// Adauga middleware pentru gestionarea sesiunilor.
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// Adauga middleware pentru initializarea 'passport'.
app.use(passport.initialize());

// Adauga middleware pentru gestionarea sesiunii 'passport'.
app.use(passport.session());

// Configurarea strategiei locale pentru autentificare. Verifica utilizatorul si parola in baza de date.
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } 
    catch (error) {
        return done(error);
    }
}));

// Serializeaza utilizatorul in sesiune, se retine doar id-ul.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializeaza utilizatorul, folosind id-ul stocat.
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        const user = rows[0];
        done(null, user);
    } 
    catch (error) {
        done(error);
    }
});

// Adauga middleware catre ruta de baza '/'.
app.use('/', routes);


// Porneste serverul.
app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
});