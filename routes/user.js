const express = require('express');
const router = express.Router();
const User = require('../collections/usermodel');
const UserProfile = require('../collections/userprofilemodel');
const { check, validationResult } = require('express-validator/check')

function validateToken(req, res, next) {
    var token = req.headers['authorization']
    if (token) {
        User.findById(token).then(result => {
            if (result) {
                next();
            } else {
                res.status(500).send('forbidden');
            }
        })
    } else {
        res.status(500).send('forbidden**');
    }
}

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
                            let newUser = new User();
                            newUser.first_name = req.body.first_name;
                            newUser.last_name = req.body.last_name;
                            newUser.user_name = req.body.user_name;
                            newUser.email = req.body.email;
                            newUser.setPassword(req.body.password);
                            newUser.save().then(result => {
                                res.send(result);
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
        User.findOne({ user_name: req.body.user_name }).then(result => {
            if (result) {
                if (result.validPassword(req.body.password)) {
                    res.send(result._id);
                } else {
                    res.status(500).send('password is incorrect');
                }

            } else {
                res.status(500).send('User name incorrect');
            }
        })
    }
});


//route to get user data
router.get('/get', validateToken, (req, res, next) => {
    User.find({}).then(data => {
        res.json(data);
    })
});



module.exports = router;