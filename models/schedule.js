const mongoose = require('mongoose');
const Joi = require('joi');
const { Semester } = require('../models/semesters');
const { Course } = require('../models/courses');

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

const Day = mongoose.model('Day', daySchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

function validateSchedule(schedule) {
    const validDay = {
        startTime: Joi.date().allow(""),
        endTime: Joi.date().allow(""),
        classroom: Joi.number().min(0).max(399).required(),
        isScheduled: Joi.boolean().required()
    };
    const validSchedule = {
        monday: Joi.object(validDay),
        tuesday: Joi.object(validDay),
        wednesday: Joi.object(validDay),
        thursday: Joi.object(validDay),
        friday: Joi.object(validDay)
    };
    
    return Joi.validate(schedule, validSchedule);
}

function validateDay(day) {
    const validDay = {
        startTime: Joi.date().allow(""),
        endTime: Joi.date().allow(""),
        classroom: Joi.number().min(0).max(399).required(),
        isScheduled: Joi.boolean().required()
    };
    
    return Joi.validate(day, validDay);
}

function createDay(day){
    const newDay = new Day({
        startTime: day.startTime,
        endTime: day.endTime,
        classroom: day.classroom,
        isScheduled: day.isScheduled
    });
    return newDay;
}

function createSchedule(mondayStart, mondayEnd, mondayRoom, mondayIsScheduled,
    tuesdayStart, tuesdayEnd, tuesdayRoom, tuesdayIsScheduled,
    wednesdayStart, wednesdayEnd, wednesdayRoom, wednesdayIsScheduled,
    thursdayStart, thursdayEnd, thursdayRoom, thursdayIsScheduled,
    fridayStart, fridayEnd, fridayRoom, fridayIsScheduled) {
    
    const monday = new Day({
        startTime: mondayStart,
        endTime: mondayEnd,
        classroom: mondayRoom,
        isScheduled: mondayIsScheduled
    });

    const tuesday = new Day({
        startTime: tuesdayStart,
        endTime: tuesdayEnd,
        classroom: tuesdayRoom,
        isScheduled: tuesdayIsScheduled
    });

    const wednesday = new Day({
        startTime: wednesdayStart,
        endTime: wednesdayEnd,
        classroom: wednesdayRoom,
        isScheduled: wednesdayIsScheduled
    });

    const thursday = new Day({
        startTime: thursdayStart,
        endTime: thursdayEnd,
        classroom: thursdayRoom,
        isScheduled: thursdayIsScheduled
    });

    const friday = new Day({
        startTime: fridayStart,
        endTime: fridayEnd,
        classroom: fridayRoom,
        isScheduled: fridayIsScheduled
    });

    const schedule = new Schedule({
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday
    });
    
    return schedule;
}

async function updateSchedule(semesterId, courseId, updatedSchedule) {
    const semester = await Semester.findById(semesterId);
    const course = semester.courses.id(courseId);
    console.log("updatedSchedule");
    console.log(updatedSchedule);
    const mondayConflict = semester.courses.find(o => 
        o._id != courseId &&
        updatedSchedule.monday.isScheduled &&
        o.schedule.monday.isScheduled &&
        o.schedule.monday.classroom == updatedSchedule.monday.classroom &&
        o.schedule.monday.endTime > updatedSchedule.monday.startTime &&
        updatedSchedule.monday.endTime > o.schedule.monday.startTime
    );

    const tuesdayConflict = semester.courses.find(o => 
        o._id != courseId &&
        updatedSchedule.tuesday.isScheduled &&
        o.schedule.tuesday.isScheduled &&
        o.schedule.tuesday.classroom == updatedSchedule.tuesday.classroom &&
        o.schedule.tuesday.endTime > updatedSchedule.tuesday.startTime &&
        updatedSchedule.tuesday.endTime > o.schedule.tuesday.startTime
    );

    const wednesdayConflict = semester.courses.find(o => 
        o._id != courseId &&
        updatedSchedule.wednesday.isScheduled &&
        o.schedule.wednesday.isScheduled &&
        o.schedule.wednesday.classroom == updatedSchedule.wednesday.classroom &&
        o.schedule.wednesday.endTime > updatedSchedule.wednesday.startTime &&
        updatedSchedule.wednesday.endTime > o.schedule.wednesday.startTime
    );

    const thursdayConflict = semester.courses.find(o => 
        o._id != courseId &&
        updatedSchedule.thursday.isScheduled &&
        o.schedule.thursday.isScheduled &&
        o.schedule.thursday.classroom == updatedSchedule.thursday.classroom &&
        o.schedule.thursday.endTime > updatedSchedule.thursday.startTime &&
        updatedSchedule.thursday.endTime > o.schedule.thursday.startTime
    );

    const fridayConflict = semester.courses.find(o => 
        o._id != courseId &&
        updatedSchedule.friday.isScheduled &&
        o.schedule.friday.isScheduled &&
        o.schedule.friday.classroom == updatedSchedule.friday.classroom &&
        o.schedule.friday.endTime > updatedSchedule.friday.startTime &&
        updatedSchedule.friday.endTime > o.schedule.friday.startTime
    );

    if(mondayConflict != null)
        throw new Error('Scheduling conflict with <a href="/courses/' + semesterId + '/' + mondayConflict.courseId + '">' + mondayConflict.courseTitle + '</a>.');    
    if(tuesdayConflict != null)
        throw new Error('Scheduling conflict with <a href="/courses/' + semesterId + '/' + tuesdayConflict.courseId + '">' + tuesdayConflict.courseTitle + '</a>.');    
    if(wednesdayConflict != null)
        throw new Error('Scheduling conflict with <a href="/courses/' + semesterId + '/' + wednesdayConflict.courseId + '">' + wednesdayConflict.courseTitle + '</a>.');    
    if(thursdayConflict != null)
        throw new Error('Scheduling conflict with <a href="/courses/' + semesterId + '/' + thursdayConflict.courseId + '">' + thursdayConflict.courseTitle + '</a>.');    
    if(fridayConflict != null)
        throw new Error('Scheduling conflict with <a href="/courses/' + semesterId + '/' + fridayConflict.courseId + '">' + fridayConflict.courseTitle + '</a>.');    
    
    course.schedule = updatedSchedule;
    await semester.save();

    return course;     
}

function buildDay(startTime, endTime, classroom, isScheduled) {
    if(!isScheduled) {
        return {
            startTime: '',
            endTime: '',
            classroom: 0,
            isScheduled: false
        };
    }
    else {
        return {
            startTime: startTime,
            endTime: endTime,
            classroom: classroom,
            isScheduled: true
        };
    }
}

exports.Day = Day;
exports.Schedule = Schedule;
exports.buildDay = buildDay;
exports.validateDay = validateDay;
exports.validateSchedule = validateSchedule;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;