const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../config/jwt');
const sendMail = require('../config/nodemailer');
const { getUser } = require('../config/db');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

//Create a user 
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const user = new User()
        user.email = email;
        user.save(function (err, doc) {
            if (err) {
                res.send(err);
            } else {
                // Send confirmation email
                let emailToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '5m' });
                sendMail('ToDid',
                    email,
                    'Confirm Your Email',
                    `Hi there, Thanks for Joining ToDid.
                    To complete account sign-up:
                    <a href="${process.env.HOST}/users/${emailToken}">Verify Your Email</a>`
                )
                res.send(doc)
            }
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

// Login a user 
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        //Login with sending an email to the user
        let emailToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await sendMail('ToDid',
            email,
            'Login to ToDid',
            `Hi there, To login to ToDid:
            <a href="${process.env.HOST}/users/${emailToken}/todos">Login</a>`
        );
        res.send('Email sent')
    } catch (error) {
        console.log(error)
        res.send(error)
    }

});

// Get all user todos
router.get('/:token/todos', authenticateToken, async (req, res) => {
    const { email } = req.user;
    try {
        let user = await getUser(email);
        let todos = user.todos;
        res.send(todos)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

// Create a todo for a user 
router.post('/:token/todos', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { todo } = req.body;
    try {
        let user = await getUser(email);
        let todos = user.todos;
        todo.order = todos.length;
        todos.push(todo);
        user.todos = todos;
        user.save(function (err, doc) {
            if (err) {
                res.send(err);
                return;
            }
            if (todo.endDate) {
                // Set a timer to send email before todo is due
                let timeToDue = todo.endDate - Date.now();  // Time in milliseconds
                let timeToEmail = timeToDue - (1000 * 60 * 60 * 2); // 2 hours in milliseconds
                let emailToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '24h' });
                setTimeout(() => {
                    sendMail('ToDid',
                        email,
                        'Todo Due Soon',
                        `Hi there, Your todo: ${todo.title} deadline is in 2h.
                    <a href="${process.env.HOST}/users/${emailToken}/todos">Login</a>`
                    )
                }, timeToEmail);
            }

            res.send(doc)
        });
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});


// Update a todo for a user 
router.put('/:token/todos/:todoId', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { todoId } = req.params;
    const { todo } = req.body;
    try {
        let user = await getUser(email);
        let todos = user.todos;
        let todoIndex = todos.findIndex(todo => todo._id == todoId);
        todos[todoIndex] = todo;
        user.todos = todos;
        user.save(function (err, doc) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(doc)
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

// Toggle a todo for a user
router.put('/:token/todos/:todoId/toggle', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { todoId } = req.params;
    try {
        let user = await getUser(email);
        let todos = user.todos;
        let todoIndex = todos.findIndex(todo => todo._id == todoId);
        todos[todoIndex].completed = !todos[todoIndex].completed;
        user.todos = todos;
        user.save(function (err, doc) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(doc)
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

// Delete a todo
router.delete('/:token/todos/:todoId', authenticateToken, async (req, res) => {
    const { email } = req.user;
    const { todoId } = req.params;
    try {
        let user = await getUser(email);
        let todos = user.todos;
        let todoIndex = todos.findIndex(todo => todo._id == todoId);
        todos.splice(todoIndex, 1);
        user.todos = todos;
        user.save(function (err, doc) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(doc)
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});


module.exports = router;
