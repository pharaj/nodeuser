const express = require('express');
const router = express.Router();
const User = require('../collections/usermodel');
const UserProfile = require('../collections/userprofilemodel');
const { check, validationResult } = require('express-validator/check')


router.post('/register', [
    check('first_name', "first name is required").not().isEmpty(),
    check('last_name', "last name is required").not().isEmpty(),
    check('email', "email is required").not().isEmpty(),
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty(),
    check('confirm_password', "confirm_password is required").not().isEmpty()
], (req, res, next) => {
    const errors = validationResult(req);
    const savingData = () => {
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

    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        savingData();
    }

});

module.exports = router;