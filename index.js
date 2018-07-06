const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

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

// Home Page
app.get('/', (req, res) => {
    res.send('Home Page');
});

// List all courses (associated with building)
app.get('/courses', (req, res) => {
    res.send('Courses Page');
});

// Read course details
app.get('/courses/:id', (req, res) => {
    res.send(req.params.id + ' Specific Course');
});

// List all classrooms
app.get('/classrooms', (req, res) => {
    res.send('Classrooms Page');
});

// Create classroom
app.post('/classrooms', (req, res) => {
    const classroom = {
        roomNumber: req.body.roomNumber,
        maxOccupancy: req.body.maxOccupancy,
        notes: req.body.notes
    };
    res.send(classroom);
});

// Read classroom
app.get('/classrooms/:id', (req, res) => {
    res.send(req.params.id + ' Specific Classroom');
});

// Update Classroom
app.put('/classroom/:id', (req, res) => {

});

// Delete Classroom
app.delete('/classrooms/:id', (req, res) => {

});

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