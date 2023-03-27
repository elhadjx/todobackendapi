const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    endDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Todo', todoSchema);