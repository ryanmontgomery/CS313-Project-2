const mongoose = require('mongoose');
const Joi = require('joi');
const { Semester } = require('../models/semesters');

const daySchema = new mongoose.Schema({   
    startTime: Date,
    endTime: Date,
    classroom: Number,
    isScheduled: Boolean
});

const scheduleSchema = new mongoose.Schema({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema
});

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    courseTitle: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    teacher: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    credits: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    description: String,
    studentCount: {
        type: Number,
        min: 1,
        max: 75,
        required: true
    },
    schedule: scheduleSchema
});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const validCourse = {
        courseName: Joi.string().min(3).max(50).required(),
        courseTitle: Joi.string().min(3).max(50).required(),
        teacher: Joi.string().min(3).max(100).required(),
        credits: Joi.number().min(1).max(5).required(),
        description: Joi.string(),
        studentCount: Joi.number().min(1).max(75).required()
    };

    return Joi.validate(course, validCourse);
}

function createCourse(courseName, courseTitle, teacher, credits, description, studentCount) {
    const unscheduledDay = {
        startTime: '',
        endTime: '',
        classroom: 0,
        isScheduled: false
    };

    const emptySchedule = {
        monday: unscheduledDay,
        tuesday: unscheduledDay,
        wednesday: unscheduledDay,
        thursday: unscheduledDay,
        friday: unscheduledDay
    };

    const course = new Course({
        courseName: courseName,
        courseTitle: courseTitle,
        teacher: teacher,
        credits: credits,
        description: description,
        studentCount: studentCount,
        schedule: emptySchedule
    });

    return course;
}

async function addCourse(semesterId, course) {
    const semester = await Semester.findById(semesterId);
    semester.courses.push(course);

    const result = await semester.save();
    return result;
}

async function readCourse(semesterId, courseId) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    return course;
}

async function updateCourse(semesterId, courseId, updatedCourse) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    course.courseName = updatedCourse.courseName;
    course.courseTitle = updatedCourse.courseTitle;
    course.teacher = updatedCourse.teacher;
    course.credits = updatedCourse.credits;
    course.description = updatedCourse.description;
    course.studentCount = updatedCourse.studentCount;

    const result = await semester.save();
    return course;
}

async function deleteCourse(semesterId, courseId) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    course.remove();
    const result = await semester.save();
    return result;
}

exports.Course = Course;
exports.validateCourse = validateCourse;
exports.createCourse = createCourse;
exports.addCourse = addCourse;
exports.readCourse = readCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;