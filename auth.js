const printUser = (req) => {
    const user = req.app.get('firebase').auth().currentUser;
    if (user) {
        console.log(user.email);
    }
}

function authCheck(req, res, next) {
    const user = req.app.get('firebase').auth().currentUser;
    if (user) {
        next();
    } else {
        res.status(401).send('User not authorized');
    }
}

const consoleView = (req, res) => {
    const user = req.app.get('firebase').auth().currentUser;
    if (user) {
        res.render('courses', { ...process.env });
    } else {
        res.status(401).send('User not authorized');
    }
}

const announcementView = (req, res) => {
    const user = req.app.get('firebase').auth().currentUser;
    if (user) {
        res.render('announcements/index', { ...process.env });
    } else {
        res.status(401).send('User not authorized');
    }
}

const logout = (req, res) => {
    req.app.get('firebase').auth().signOut().then(_ => {
        console.log('user signed out successful');
        printUser(req);
        res.json({ 'message': 'success' })
    }).catch(err => {
        console.log('logout error')
        console.log(err);
        res.json({ 'message': 'error' })
    })
}

const auth = (req, res) => {
    const id_token = req.body.token;
    // Build Firebase credential with the Google ID token.
    const credential = req.app.get('firebase').auth.GoogleAuthProvider.credential(id_token);

    // Sign in with credential from the Google user.
    req.app.get('firebase').auth().signInWithCredential(credential).then(_ => {
        printUser(req);
        res.json({ 'message': 'success' })
    }).catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        res.json({ 'message': 'error' })
    });
}

module.exports = {
    consoleView, announcementView, logout, auth, authCheck
};