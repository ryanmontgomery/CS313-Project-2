const { Semester } = require('../models/semesters');
const { validateCourse, createCourse, addCourse, readCourse, updateCourse, deleteCourse } = require('../models/courses');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
var error = "";

router.get('/', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to view courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
    }
    else res.redirect('/courses/' + req.session.semId);
});

router.get('/create', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to edit courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else res.render('pages/courses/create', { ssnSemName: req.session.semName, ssnSemId: req.session.semId });
});

router.get('/update', async (req, res) => {
    error = "You must choose a semester schedule in order to edit courses.";
    const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
    res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
    error = "";
});

router.get('/update/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to edit courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.semesterId)) {
        error = "Invalid semester.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
        error = "Invalid course.";
        const semester = await Semester.findById(req.params.semesterId);
        const courses = semester.courses;
        res.render('pages/courses/index', { courses: courses, ssnSemName: req.session.semName, ssnSemId: req.session.semId , error: error });
        error = "";
    }
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/update', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
    }
});

router.get('/delete/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to delete courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.semesterId)) {
        error = "Invalid semester.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
        error = "Invalid course.";
        const semester = await Semester.findById(req.params.semesterId);
        const courses = semester.courses;
        res.render('pages/courses/index', { courses: courses, ssnSemName: req.session.semName, ssnSemId: req.session.semId , error: error });
        error = "";
    }
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/delete', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId });
    }
});

router.get('/:id', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to delete courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        error = "Invalid semester.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else {
        const semester = await Semester.findById(req.params.id);
        const courses = semester.courses;
        res.render('pages/courses/index', { courses: courses, ssnSemName: req.session.semName, ssnSemId: req.session.semId, error: error });
    }
});

router.get('/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) {
        error = "You must choose a semester schedule in order to view courses.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.semesterId)) {
        error = "Invalid semester.";
        const semesters = await Semester.find().sort('-startDate').select({ _id: 1, semesterName: 1 });
        res.render('pages/index', { semesters: semesters, ssnSemName: req.session.semName, error: error });
        error = "";
    }
    else if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
        error = "Invalid course.";
        const semester = await Semester.findById(req.params.semesterId);
        const courses = semester.courses;
        res.render('pages/courses/index', { courses: courses, ssnSemName: req.session.semName, ssnSemId: req.session.semId , error: error });
        error = "";
    }
    else {
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/courses/details', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId, dateFormat: dateFormat });
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