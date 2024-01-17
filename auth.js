const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findUserByUsername } = require('./models/user');

// Se configureaza o strategie locala pentru autentificare.
passport.use(
    new LocalStrategy(async (username, password, done) => {

        // Se incearca gasirea utilizatorului pe baza username-ului.
        try {
            const user = await findUserByUsername(username);
            
            // Daca utilizatorul nu exista, se returneaza un mesaj de eroare.
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            // Daca parola nu se potriveste, se returneaza un mesaj de eroare.
            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // Daca ambele conditii sunt indeplinite, se returneaza utilizatorul autentificat.
            return done(null, user);
        } 
        catch (error) {
            return done(error);
        }
    })
);

// Serializeaza utilizatorul pentru a-l adauga intr-o sesiune (in sesiune se pastreaza doar id-ul utilizatorului).
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializeaza utilizatorul folosind id-ul stocat in sesiune.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } 
    catch (error) {
        done(error);
    }
});