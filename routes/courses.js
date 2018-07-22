const { Semester } = require('../models/semesters');
const { validateCourse, createCourse, addCourse, readCourse, updateCourse, deleteCourse } = require('../models/courses');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else res.redirect('/courses/' + req.session.semId);
});

router.get('/create', (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else res.render('pages/courses/create', { ssnSemName: req.session.semName, ssnSemId: req.session.semId });
});

router.get('/update/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/update', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
    }
});

router.get('/confirmDelete/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/confirmDelete', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
    }
});

router.get('/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    const semester = await Semester.findById(req.params.id);
    const courses = semester.courses;
    res.render('pages/courses/index', { courses: courses, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
});

router.get('/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/details', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
    }
});

router.post('/:id', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = createCourse(req.body.courseName, req.body.courseTitle, req.body.teacher, req.body.credits, req.body.description, req.body.studentCount);
    const result = await addCourse(req.params.id, course);
    res.redirect('/courses/' + req.session.semId + '/' + course._id);
});

router.put('/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = createCourse(req.body.courseName, req.body.courseTitle, req.body.teacher, req.body.credits, req.body.description, req.body.studentCount);
    const result = await updateCourse(req.params.semesterId, req.params.courseId, course);
    res.redirect('/courses/' + req.session.semId + '/' + req.params.courseId);
});

router.delete('/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    const course = await deleteCourse(req.params.semesterId, req.params.courseId);
    res.redirect('/courses/' + req.session.semId);
});

module.exports = router;