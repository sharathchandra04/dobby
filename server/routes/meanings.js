import express from 'express';
import {
    fetchAll,
    getMeaning,
    getWords,
    save,
    update,
    check
} from '../controllers/meanings'
const authrouter = express.Router();

authrouter.get('/fetch_all', fetchAll);
authrouter.get('/get_meaning', getMeaning);
authrouter.get('/check', check);
authrouter.post('/save', save);
authrouter.get('/get_words', getWords);
authrouter.post('/update', update);

// authrouter.use('/logout', logout);

module.exports = authrouter;