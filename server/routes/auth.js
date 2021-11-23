import express from 'express';
import {googleAuthentication, logout} from '../controllers/auth'
const authrouter = express.Router();

authrouter.post('/google', googleAuthentication);
authrouter.get('/logout', logout);

module.exports = authrouter;