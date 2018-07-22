const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const Classroom = mongoose.model('Classroom', new mongoose.Schema({
    roomNumber: {
        type: Number,
        min: 0,
        max: 999,
        required: true,
        unique: true
    },
    maxOccupancy: {
        type: Number,
        min: 30,
        max: 75,
        required: true
    },
    notes: String
}).plugin(uniqueValidator, { message: '{VALUE} is already a registered room.' }));


function validateClassroom(classroom) {
    const validClassroom = {
        roomNumber: Joi.number().min(0).max(999).required(),
        maxOccupancy: Joi.number().min(30).max(75).required(),
        notes: Joi.string()
    };

    return Joi.validate(classroom, validClassroom);
}

async function addClassroom(room, max, notes) {
    const classroom = new Classroom({
        roomNumber: room,
        maxOccupancy: max,
        notes: notes
    });

    const result = await classroom.save();
    return result;
}

async function readClassroom(id) {
    const classroom = await Classroom.findById(id);
    return classroom;
}

async function updateClassroom(id, room, max, notes) {
    const classroom = await Classroom.findById(id);
    classroom.roomNumber = room;
    classroom.maxOccupancy = max;
    classroom.notes = notes;

    const result = await classroom.save();
    return result;
}

async function deleteClassroom(id) {
    const result = await Classroom.deleteOne({ _id: id });
    return result;
}


exports.Classroom = Classroom;
exports.validateClassroom = validateClassroom;
exports.addClassroom = addClassroom;
exports.readClassroom = readClassroom;
exports.updateClassroom = updateClassroom;
exports.deleteClassroom = deleteClassroom;