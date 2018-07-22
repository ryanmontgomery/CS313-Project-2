const { Semester } = require('../models/semesters');
const { Classroom } = require('../models/classroom');
const { buildDay, Schedule, validateDay, validateSchedule, createSchedule, updateSchedule } = require('../models/schedule');
const { readCourse } = require('../models/courses');
const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');

router.get('/:semesterId/:room', async (req, res) => {
    //TODO GET A ROOMS SCHEDULE
});

router.get('/update/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        const classrooms = await Classroom.find().sort('-roomNumber').select({ roomNumber: 1 });
        const course = await readCourse(req.params.semesterId, req.params.courseId);
        res.render('pages/schedules/update', { course: course, ssnSemName: req.session.semName, ssnSemId: req.session.semId, classrooms: classrooms });
    }
});

router.put('/:semesterId/:courseId', async (req, res) => {
    if(!req.session.semId) res.redirect('/');
    else {
        var schedule;
        if(req.body.scheduleType == 'consistent') {
            var startTime = new Date('1970-01-01T' + req.body.startTime + 'Z');
            var endTime = new Date('1970-01-01T' + req.body.endTime + 'Z');
            var classroom = req.body.roomNumber;
            schedule = {
                monday: buildDay(startTime, endTime, classroom, req.body.mondayScheduled != null),
                tuesday: buildDay(startTime, endTime, classroom, req.body.tuesdayScheduled != null),
                wednesday: buildDay(startTime, endTime, classroom, req.body.wednesdayScheduled != null),
                thursday: buildDay(startTime, endTime, classroom, req.body.thursdayScheduled != null),
                friday: buildDay(startTime, endTime, classroom, req.body.fridayScheduled != null)
            };
        } else {
            schedule = {
                monday: buildDay(new Date('1970-01-01T' + req.body.mondayStartTime + 'Z'),
                    new Date('1970-01-01T' + req.body.mondayEndTime + 'Z'),
                    req.body.mondayRoomNumber,
                    req.body.mondayScheduled != null),
                tuesday: buildDay(new Date('1970-01-01T' + req.body.tuesdayStartTime + 'Z'),
                    new Date('1970-01-01T' + req.body.tuesdayEndTime + 'Z'),
                    req.body.tuesdayRoomNumber,
                    req.body.tuesdayScheduled != null),
                wednesday: buildDay(new Date('1970-01-01T' + req.body.wednesdayStartTime + 'Z'),
                    new Date('1970-01-01T' + req.body.wednesdayEndTime + 'Z'),
                    req.body.wednesdayRoomNumber,
                    req.body.wednesdayScheduled != null),
                thursday: buildDay(new Date('1970-01-01T' + req.body.thursdayStartTime + 'Z'),
                    new Date('1970-01-01T' + req.body.thursdayEndTime + 'Z'),
                    req.body.thursdayRoomNumber,
                    req.body.thursdayScheduled != null),
                friday: buildDay(new Date('1970-01-01T' + req.body.fridayStartTime + 'Z'),
                    new Date('1970-01-01T' + req.body.fridayEndTime + 'Z'),
                    req.body.fridayRoomNumber,
                    req.body.fridayScheduled != null)
            };
        }
        const { error } = validateSchedule(schedule);
        if (error) return res.status(400).send(error);
        
        try {
            const result = await updateSchedule(req.params.semesterId, req.params.courseId, new Schedule(schedule));
            res.redirect('/courses/' + req.params.semesterId + '/' + req.params.courseId);
        }
        catch (ex) {
            console.log(ex);
            res.send(ex.message);
        }
    }
    
});

module.exports = router;