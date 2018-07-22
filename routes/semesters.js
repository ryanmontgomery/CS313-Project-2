const {Semester, validateSemester, addSem, readSem, updateSem, deleteSem} = require('../models/semesters');
const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');

router.get('/', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const semesters = await Semester.find().sort('-startDate');
        res.render('pages/semesters/index', { ssnSemName: req.session.semName, semesters: semesters, dateFormat: dateFormat});
    }
});

router.get('/create', (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else res.render('pages/semesters/create', { ssnSemName: req.session.semName });
});

router.get('/update/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const semester = await readSem(req.params.id);
        res.render('pages/semesters/update', { ssnSemName: req.session.semName, semester: semester });
    }
});

router.get('/delete/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const semester = await readSem(req.params.id);
        res.render('pages/semesters/delete', { ssnSemName: req.session.semName, semester: semester, dateFormat: dateFormat});
    }
});

router.post('/', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const { error } = validateSemester(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const semester = await addSem(req.body.semesterName, req.body.startDate, req.body.endDate);
        res.redirect('/semesters/' + semester._id);
    }
});

router.get('/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const semester = await readSem(req.params.id);
        res.render('pages/semesters/details', { dateFormat: dateFormat, ssnSemName: req.session.semName, semester: semester });
    }
});

router.put('/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const { error } = validateSemester(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        const semester = await updateSem(req.params.id, req.body.semesterName, req.body.startDate, req.body.endDate);
        res.redirect('/semesters/' + semester._id);
    }
});

router.delete('/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const semester = await deleteSem(req.params.id);
        if (req.session.semId == req.params.id) req.session.destroy();
        res.redirect('/semesters/');
    }
    
});

module.exports = router;