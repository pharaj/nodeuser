const express = require('express');
const router = express.Router();
const User = require('../collections/usermodel');
const UserProfile = require('../collections/userprofilemodel');
const { check, validationResult } = require('express-validator/check');
const md5 = require('md5');

const validateToken = async (req, res, next) => {
    let token = req.headers['authorization']
    if (token) {
        const result = await User.findById(token);
        if (result) {
            next();
        } else {
            res.status(500).send('forbidden')
        }
    } else {
        res.status(500).send('forbidden**');
    }
}

const authorization = async (req, res, next) => {
    let token = req.headers['x-auth-token']
    if (token) {
        const result = await UserProfile.findOne({ access_token: token });
        if (result) {
            next();
        } else {
            res.json('not authorized');
        }
    } else {
        res.status(500).json('token is required')
    }
}


//route for register
router.post('/register', [
    check('first_name', "first name is required").not().isEmpty(),
    check('last_name', "last name is required").not().isEmpty(),
    check('email', "email is required").not().isEmpty(),
    check('email', "should be a email").isEmail(),
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty(),
    check('confirm_password', "confirm_password is required").not().isEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        if (req.body.password == req.body.confirm_password) {
            const result = await User.findOne({ email: req.body.email });
            if (result) {
                res.status(400).send('email already saved');
            } else {
                const response = await User.findOne({ user_name: req.body.user_name });
                if (response) {
                    res.status(400).send('username already existed');
                } else {
                    let newUser = new User();
                    newUser.first_name = req.body.first_name;
                    newUser.last_name = req.body.last_name;
                    newUser.user_name = req.body.user_name;
                    newUser.email = req.body.email;
                    newUser.setPassword(req.body.password);
                    const saveUser = await newUser.save()
                    res.json(saveUser);
                }
            }
        } else {
            res.status(400).send('password not matched');
        }
    }

});


//route for login
router.post('/login', [
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        const result = await User.findOne({ user_name: req.body.user_name })
        if (result) {
            if (result.validPassword(req.body.password)) {
                let newProfile = new UserProfile();
                const token = newProfile.getToken(result);
                const saveprofile = await newProfile.save()
                res.header('x-auth-token', token).json(result);
            } else {
                res.status(500).send('password is incorrect');
            }
        } else {
            res.status(500).send('User name incorrect');
        }
    }
});

//route to get user data
router.get('/get', validateToken, async (req, res, next) => {
    const response = await User.find({});
    res.json(response);
});

//route to delete user data
router.put('/delete', validateToken, async (req, res, next) => {
    const response = await User.findOneAndDelete({ _id: req.headers['authorization'] });
    res.json(response);
});


//route to return list of users
router.get('/list/:page/:count', async (req, res, next) => {
    const pagenum = Number(req.params.page);
    const usercount = Number(req.params.count);
    const data = await User.find({}).skip(pagenum * usercount).limit(usercount);
    res.json(data);
});


//route for user address
router.post('/address', authorization, (req, res, next) => {
    res.json('authorization compeleted');
})



module.exports = router;