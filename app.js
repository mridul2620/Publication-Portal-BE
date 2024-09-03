require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const loginRoutes = require('./routes/User/login');
const registerRoutes = require('./routes/User/register');
const userRoutes = require('./routes/User/users');
const deleteUserRoutes = require('./routes/User/deleteUser');
const forgotPasswordRoutes = require('./routes/Password/forgot');
const resetPasswordRoutes = require('./routes/Password/reset'); 
const changePasswordRoutes = require('./routes/Password/changepassword');
const editUserRoutes = require('./routes/User/editUser');
const Vehicles = require('./models/vehicle/vehicle');
const addVehicleRoutes = require('./routes/Vehicles/addVehicle');
const getVehicleRoutes = require('./routes/Vehicles/getVehicles');
const updateVehicleRoutes = require('./routes/Vehicles/updateVehicle');
const deleteVehicleRoutes = require('./routes/Vehicles/deleteVehicle');
const deleteAllVehiclesRoute = require('./routes/Vehicles/deleteallVehicles');
const path = require('path');
const connectorRoutes = require('./routes/Connectors/addConnector');
const showConnector = require('./routes/Connectors/getConnectors');
var cors = require('cors');


const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(loginRoutes);
app.use(registerRoutes);
app.use(userRoutes);
app.use(deleteUserRoutes);
app.use(forgotPasswordRoutes);
app.use(resetPasswordRoutes);
app.use(changePasswordRoutes);
app.use(editUserRoutes);
app.use(addVehicleRoutes);
app.use(getVehicleRoutes);
app.use(updateVehicleRoutes);
app.use(deleteVehicleRoutes);
app.use(deleteAllVehiclesRoute);
app.use('/', connectorRoutes);
app.use(showConnector);

app.get('/add-connector', (req, res) => {
    res.render('addConnector');
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});