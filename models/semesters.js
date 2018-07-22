const mongoose = require('mongoose');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

//--------------Mongoose Schema--------------//
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
        maxlength: 255,
        required: true
    },
    courseTitle: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    teacher: {
        type: String,
        minlength: 3,
        maxlength: 255,
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

const semesterSchema = new mongoose.Schema({
    semesterName: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    courses: [courseSchema]
});

const Semester = mongoose.model('Semester', semesterSchema);

function validateSemester(semester) {
    const validSemester = {
        semesterName: Joi.string().min(3).max(50).required(),
        startDate: Joi.date().format('YYYY-MM-DD').required(),
        endDate: Joi.date().required(),
        courses: Joi.array()
    };

    return Joi.validate(semester, validSemester);
}

async function addSemester(name, start, end) {
    const semester = new Semester({
        semesterName: name,
        startDate: start,
        endDate: end,
        courses: []
    });

    const result = await semester.save();
    return result;
}

async function readSemester(id) {
    const semester = await Semester.findById(id);
    return semester;
}

async function updateSemester(id, name, start, end) {
    const semester = await Semester.findById(id);
    semester.semesterName = name;
    semester.startDate = start;
    semester.endDate = end;

    const result = await semester.save();
    return result;
}

async function deleteSemester(id) {
    const result = await Semester.deleteOne({ _id: id });
    return result;
}

/*
async function addCourse(semesterId, course) {
    const semester = await Semester.findById(semesterId);
    semester.courses.push(course);
    semester.save();
    console.log(semester);
}

async function readCourse(semesterId, courseId) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    console.log(course);
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
    console.log(result);
}

async function deleteCourse(semesterId, courseId) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    course.remove();
    semester.save();
    console.log(course);
}

async function updateSchedule(semesterId, courseId, schedule){
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    course.schedule.monday = schedule.monday;
    course.schedule.tuesday = schedule.tuesday;
    course.schedule.wednesday = schedule.wednesday;
    course.schedule.thursday = schedule.thursday;
    course.schedule.friday = schedule.friday;

    const result = await semester.save();
    console.log(result);
}
*/


exports.Semester = Semester;
exports.validateSemester = validateSemester;
exports.addSem = addSemester;
exports.readSem = readSemester;
exports.updateSem = updateSemester;
exports.deleteSem = deleteSemester;