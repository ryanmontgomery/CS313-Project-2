const { Classroom, validateClassroom, addClassroom, readClassroom, updateClassroom, deleteClassroom } = require('../models/classroom');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var error = "";

router.get('/', async (req, res) => {
    const classrooms = await Classroom.find().sort('roomNumber');
    res.render('pages/classrooms/index', { classrooms: classrooms, error: error });
});

router.get('/create', (req, res) => {
    res.render('pages/classrooms/create');
});

router.get('/update/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        error = "Invalid classroom.";
        const classrooms = await Classroom.find().sort('roomNumber');
        res.render('pages/classrooms/index', { classrooms: classrooms, error: error });
        error = "";
    }
    else {
        const classroom = await readClassroom(req.params.id);
        res.render('pages/classrooms/update', { classroom: classroom });
    }
});

router.get('/delete/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        error = "Invalid classroom.";
        const classrooms = await Classroom.find().sort('roomNumber');
        res.render('pages/classrooms/index', { classrooms: classrooms, error: error });
        error = "";
    }
    else {
        const classroom = await readClassroom(req.params.id);
        res.render('pages/classrooms/delete', {classroom: classroom });
    }
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        error = "Invalid classroom.";
        const classrooms = await Classroom.find().sort('roomNumber');
        res.render('pages/classrooms/index', { classrooms: classrooms, error: error });
        error = "";
    }
    else {
    const classroom = await readClassroom(req.params.id);
    res.render('pages/classrooms/details', { classroom: classroom });
    }
});

router.post('/', async (req, res) => {
    const { error } = validateClassroom(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const classroom = await addClassroom(req.body.roomNumber, req.body.maxOccupancy, req.body.notes);
        res.redirect('/classrooms/' + classroom._id);
    }
    catch(ex) {
        res.send(ex.message);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validateClassroom(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const classroom = await updateClassroom(req.params.id, req.body.roomNumber, req.body.maxOccupancy, req.body.notes);
        res.redirect('/classrooms/' + classroom._id);
    }
    catch(ex) {
        res.send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    const classroom = await deleteClassroom(req.params.id);
    res.redirect('/classrooms');
});

module.exports = router;