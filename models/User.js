const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please type your email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});




module.exports = mongoose.model('User', userSchema);