const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const home = require('./routes/home');
const semesters = require('./routes/semesters');
const courses = require('./routes/courses');
const schedule = require('./routes/schedule');
const classrooms = require('./routes/classrooms');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({secret: 'XASDASDA', saveUninitialized: false, resave: false}));
app.use(express.static(__dirname + '/public'));
app.use('/', home);
app.use('/semesters', semesters);
app.use('/courses', courses);
app.use('/schedule', schedule);
app.use('/classrooms', classrooms);


console.log(`app: ${app.get('env')}`);

// Connect to cloud DB
if (app.get('env') === 'production') {
    mongoose.connect('mongodb://' + config.get('dbUser') + ':' + config.get('dbPassword') + config.get('dbConnect'))
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
}

// Connect to local DB
else if (app.get('env') === 'development') {
    mongoose.connect(config.get('db'))
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
}

// Create classroom event
app.post('/classroomSchedule', (req, res) => {

});

// Read classroom's events
app.get('/classroomSchedule/:id', (req, res) => {

});

// Update classroom's events
app.put('/classroomSchedule/:id', (req, res) => {

});

// Delete clasroom event
app.delete('classroomSchedule/:id', (req, res) => {

});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));