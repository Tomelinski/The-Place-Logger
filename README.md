# Trip-Logger
A web app where users can log where they're been in the world

Users can login to their account and track where they've been in the world, and store their favourite memery and picture from that location.

This web app was built with a React front-end, Node/Express back-end and a MongoDB database. This app utilizes the Google Maps Embed and Google Geolocation APIs, and features a REST API in the back-end.

## Demo

### The Homepage to the Trip-logger web app
![Homepage](/demo-images/homepage.JPG)

### The sign-up page
![Signup Page](/demo-images/usersignup.JPG)

### User profile page
![Profile Page](/demo-images/places.JPG)

## Install
```
git clone https://github.com/Tomelinski/Trip-Logger.git
cd Trip-Logger
```
### Frontend:
```
cd client
npm install
npm start
```
### Backend:
```
cd server
npm install
npm start
```

## Libraries used
### Frontend
- google-map-react
- react-transition-group
- styled-components

### Backend
- axios
- bcryptjs
- body-parser
- express
- express-validator
- jsonwebtoken
- multer
- uuid
