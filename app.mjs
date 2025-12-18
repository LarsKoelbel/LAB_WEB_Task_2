import createError from 'http-errors';
import express from 'express';
//import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
import dotenv from 'dotenv';
dotenv.config({ path: path.join(_dirname, '.env') });

import cookieParser from 'cookie-parser';
import logger from 'morgan';


import nunjucks from 'nunjucks';

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// connect database
import connectDB from './db.mjs';
await connectDB();

// import your new routes here
import authRouter from "./routes/auth.mjs";
import publicRouter from './routes/calenderPublic.mjs';
import privateRouter from './routes/calenderPrivate.mjs';

const app = express();

// Security middleware - since we use not https for education, we have to disable helmet
//app.use(helmet());

import session from 'express-session';
import passport from 'passport';
import { ensureAuthenticatedApi, ensureAuthenticatedStatic } from './middleware/authMiddleware.mjs';
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
import passport_config from './config/passport.mjs';
passport_config(passport);
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'njk');
nunjucks.configure(path.join(_dirname, 'views'), {
    autoescape: true,
    express: app,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/staff', ensureAuthenticatedStatic, express.static(path.join(_dirname, 'staff')));
app.use(express.static(path.join(_dirname, 'public')));
// Route for viewing details
app.get('/view', (req, res) => {
    res.sendFile(path.join(_dirname, 'public', 'termin-detail.html'));
});


const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Calender",
            version: "0.1.0",
            description:
                "A simple calder system",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Vincent Horn, Lars Kölbel",
                url: "https:calender.lk-vt.de",
                email: "this.is.not@an-email.no",
            },
        },
    },
    apis: [`${_dirname}/routes/*.mjs`, `${_dirname}/models/*.mjs`],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs) );

// api routes
app.use('/api/auth', authRouter);
app.use('/api/public/', publicRouter);
app.use('/api/private/', ensureAuthenticatedApi, privateRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// error handler
app.use((err, req, res, next) => {
    // Set locals
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Send error response
    res.status(err.status || 500);
    res.render('error');
});

export default app;
