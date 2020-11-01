const { v4: uuidv4 } = require('uuid');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/users');

const getusers = async (req,res,next) => {
    let users;

    try{
        users = await User.find({}, '-password');
    }catch(err){
        const error = new HttpError('fetching users failed, please try again', 500);
        return next(error);
    }

    res.status(200).json({ users: users.map(user=>user.toObject({ getters: true })) });
};

const signup = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid input', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({ email: email });
    } catch(err){
        const error = new HttpError('Signup failed, please try again', 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('user already exists, please try again', 422);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new HttpError('Signup failed, please try again', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places:[]
    });

    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError('Sign up failed, please try again', 500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 
            'secret_key', 
            {expiresIn: '2h'}
        );
    }catch(err){
        const error = new HttpError('Sign up failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({ userId: createdUser.id, email:createdUser.email, token: token });
};

const login = async (req,res,next) => {
    const {email, password} = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({ email });
    } catch(err){
        const error = new HttpError('Login failed, please try again', 500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError('Invalid password, login failed', 500);
        return next(error);
    }

    let isValidPassword = false;

    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err){
        const error = new HttpError('could not log in, please try again', 500);
        return next(error);
    }

    if (!isValidPassword){
        const error = new HttpError('Invalid password, please try again', 401);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, 
            'secret_key', 
            {expiresIn: '2h'}
        );
    }catch(err){
        const error = new HttpError('login failed, please try again', 500);
        return next(error);
    }

    res.json({ userId: existingUser.id, email:existingUser.email, token: token });
};

exports.getusers = getusers;
exports.signup = signup;
exports.login = login;