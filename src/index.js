import util from './util/util.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import routesIndex from './routes/routesIndex.js';
import routesAuth from './routes/routesAuth.js';
import routesProfile from './routes/routesProfile.js';
import routesPost from './routes/routesPost.js';
import middlewares from './middlewares/middlewares.js';

const app = express();

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('views', util.viewsDirectory);

app.use(cookieParser());
app.use(express.static(util.publicDirectory));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.populateUserSession);

app.use('/', routesIndex);
app.use('/', routesAuth);
app.use('/', routesProfile);
app.use('/', routesPost);

app.use(middlewares.renderError);

app.listen(process.env.port || 3000);
