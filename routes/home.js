const { Semester } = require('../models/semesters');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
    res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName });
});

router.post('/', async (req, res) => {
    const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
    req.session.semId = req.body.semesterId;
    req.session.semName = semesters.find(o => o._id == req.session.semId).semesterName;
    res.redirect('/courses/' + req.session.semId);
});

module.exports = router;