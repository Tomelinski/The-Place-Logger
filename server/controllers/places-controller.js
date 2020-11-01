const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const getCoordsFromAddress = require('../util/location');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/users');

const getPlaceById = async (req, res, next) =>{
    const placeId = req.params.pid;

    let place;

    try{
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError('Something went wrong, could not find place', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find place for the provided id', 404);
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) });

};

const getPlacesByUserID = async (req, res, next) =>{
    const userId = req.params.uid;
    
    let places;

    try{
        places = await Place.find({ creator: userId });
    }catch(err){
        const error = new HttpError('Something went wrong, could not fetch user ID', 500);
        return next(error);
    }

    if(!places || places.length === 0){
        return next(new HttpError('Could not find places for the provided User id', 404));
    }

    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid input', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;

    try{
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not Authorized to edit this place', 401);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try{
        await place.save();
    }catch(err){
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    
    let place;

    try{
        place = await Place.findById(placeId).populate('creator');
    } catch (err){
        const error = new HttpError('Something went wrong, could not locate and Delete place', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find place for this id', 404);
        return next(error);
    }

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not Authorized to delete this place', 401);
        return next(error);
    }

    const imagePath = place.image;

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Something went wrong, could not Delete place', 500);
        return next(error);
    }

    fs.unlink(imagePath, err=>{console.log(err);});

    res.status(200).json({message: "place Deleted."});
};

const createPlace = async (req, res, next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid input passed', 422));
    }

    const { title, description, address } = req.body;
    let coordinates;
    try{
        coordinates = await getCoordsFromAddress(address);
    } catch (err){
        return next(new HttpError('Invalid input passed', 422));
    }
    //mongo db logic
    const createdPlace = new Place({
        title,
        description,
        image: req.file.path,
        address,
        location: coordinates,
        creator: req.userData.userId
    });

    let user;

    try{
        user = await User.findById(req.userData.userId);
    }catch(err){
        return next(new HttpError('Create place failed, could not find userID', 422));
    }

    if(!user){
        return next(new HttpError('could not find user for provided user', 404));
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Failed to create place, please try again', 500);
        return next(error);
    }

    res.status(201).json({place : createdPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserID = getPlacesByUserID;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
