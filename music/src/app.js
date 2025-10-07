import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import musicRoutes from './routes/music.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api/music', musicRoutes);




export default app;