const mongoose = require('mongoose')
const User = require('../models/User')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.log(error)
    }
}

const getUser = async (email) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    connectDB,
    getUser
}