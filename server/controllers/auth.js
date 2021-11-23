const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLECLIENTAPI);
import db from '../db/db';
export const googleAuthentication = async (req, res) => {
    try{
        const { token }  = req.body
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();
        db.query('select * from users where email = ?', [email], (err, results) => {
            if(err){
                console.log(err);
                throw err;
            }
            if(!results.length){
                db.query('insert into users (email, name, image) values(?,?,?)', 
                    [email, name, picture],
                    (err, results) => {
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        req.session.email = email;
                        req.session.name = name;
                        req.session.isAuthenticated = true;
                        
                        // var time = 7 * 24 * 3600 * 1000; //1 weeks
                        var time = 3600*1000;                    
                        req.session.cookie.expires = new Date(Date.now() + time);
                        req.session.cookie.maxAge = time; 
                
                        res.status(201);
                        res.json({
                            name: name, 
                            email: email, 
                            picture: picture, 
                            msg:'user registered successfully successfully'
                        });
                        // res.json({name, email, picture});        
                    }
                );
            }
            else{
                req.session.email = email;
                req.session.name = name;
                req.session.isAuthenticated = true;
                
                var time = 3600*1000;                    
                req.session.cookie.expires = new Date(Date.now() + time);
                req.session.cookie.maxAge = time; 
                
                res.status(201);
                res.json({
                    name: name, 
                    email: email, 
                    picture: picture, 
                    msg:'user loggedin successfully'
                });
            }
        })
    }
    catch(err){
        res.status(500);
        res.json({error: 'unexpexted error'});
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    res.status(200);
    res.json({message: 'logout succesfully'});
}