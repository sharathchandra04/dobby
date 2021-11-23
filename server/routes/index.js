import express from 'express';
import authRouter from './auth';
import meaningsRouter from './meanings';

const indexrouter = express.Router();

indexrouter.use('/auth', authRouter);
indexrouter.use('/meanings', meaningsRouter);

module.exports = indexrouter;