const express = require('express');
const router = express.Router();
const User = require('../collections/usermodel');
const UserProfile = require('../collections/userprofilemodel');
const { check, validationResult } = require('express-validator/check')

//route for register
router.post('/register', [
    check('first_name', "first name is required").not().isEmpty(),
    check('last_name', "last name is required").not().isEmpty(),
    check('email', "email is required").not().isEmpty(),
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty(),
    check('confirm_password', "confirm_password is required").not().isEmpty()
], (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        if (req.body.password == req.body.confirm_password) {
            User.findOne({ email: req.body.email }).then((result) => {
                if (result) {
                    res.status(400).send('email already saved');
                } else {
                    User.findOne({ user_name: req.body.user_name }).then((response) => {
                        if (response) {
                            res.status(400).send('username already existed');
                        } else {
                            User.create(req.body).then((data) => {
                                res.send(data);
                            })
                        }
                    })
                }
            })
        } else {
            res.send('password not matched');
        }
    }

});


//route for login
router.post('/login', [
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty()
], (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        User.findOne({ user_name: req.body.user_name }).then((result) => {
            if (result) {
                User.findOne({ password: req.body.password }).then((data) => {
                    if (data) {
                        res.send(result._id);
                    } else {
                        res.status(500).send('password is incorrect');
                    }
                })
            } else {
                res.status(500).send("user name is incorrect");
            }
        }).catch(next);
    }
});


//route to get user data
router.get('/get', (req, res, next) => {
    User.find({}).then(result => {
        res.send(result);
    })
});

module.exports = router;