const { course_getAll, course_deleteById, course_findById, course_findByName,
    course_patch, course_post, course_init } = require('./courseInfo.js');
const { consoleView, announcementView, logout, auth, authCheck } = require('./auth.js');
const { announcement_getAll, announcement_deleteById, announcement_findById, 
    announcement_findByName, announcement_patch, announcement_post } = require('./announcements.js');

// START server config
const express = require('express');
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

const bodyParser = require('body-parser');
require('dotenv').config();
// END server config

// START Firebase Auth
const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
    apiKey: process.env.firebase_apiKey,
    authDomain: 'cometplanning.firebaseapp.com',
    databaseURL: 'https://cometplanning.firebaseio.com',
    projectId: 'cometplanning',
    storageBucket: 'cometplanning.appspot.com',
    messagingSenderId: process.env.firebase_messagingSenderId,
    appId: process.env.firebase_appId
};
firebase.initializeApp(firebaseConfig);
// END Firebase Auth

// START Firestore init
const admin = require('firebase-admin');
const serviceAccount = {
    'project_id': process.env.firestore_project_id,
    'private_key': process.env.firestore_private_key.replace(/\\n/g, '\n'),
    'client_email': process.env.firestore_client_email,
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);
app.set('db', db);
app.set('firebase', firebase)
app.set('increment', increment);
app.set('decrement', decrement);
// END Firestore init

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// START server routing
const port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log(`Server started on ${port}`)
});

app.get('/console', authCheck, consoleView);
app.get('/anncmnt', authCheck, announcementView);
app.get('/logout', logout);
app.post('/auth', auth)

app.get('/courses', authCheck, course_getAll);
app.post('/courses', authCheck, course_post);
app.get('/courses/id/:id', authCheck, course_findById);
app.get('/courses/name/:name', authCheck, course_findByName);
app.delete('/courses/:id', authCheck, course_deleteById);
app.put('/courses/:id', authCheck, course_patch);

app.get('/announcements', authCheck, announcement_getAll);
app.post('/announcements', authCheck, announcement_post);
app.get('/announcements/id/:id', authCheck, announcement_findById);
app.get('/announcements/name/:name', authCheck, announcement_findByName);
app.delete('/announcements/:id', authCheck, announcement_deleteById);
app.put('/announcements/:id', authCheck, announcement_patch);

app.get('/', (req, res) => {
    res.render('login', { ...process.env });
})

app.use(express.static(__dirname + '/public'))
