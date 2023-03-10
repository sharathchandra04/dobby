import db from './db/pg';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import indexrouter from './routes/index';

var morgan = require('morgan')

const app = express();

app.use(morgan('dev'))
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV != 'development'
const isProduction1 = process.env.ENVIRONMENT != 'development'
// const DIST_DIR = path.join(__dirname, `../dist/${isProduction?'prod':'dev'}`);
// const HTML_FILE = path.join(DIST_DIR, 'index.html');

//migrations-start
// var DbMigrate = require('db-migrate'); 
// var dbm = DbMigrate.getInstance(true, {
//   env: isProduction?'production':'development',
//   config: path.join(__dirname, './db/database.json'),
//   cmdOptions: {
//     'migrations-dir': path.join(__dirname, './db/migrations') 
//   },
//   throwUncatched: true
// });
// dbm.up()
// .then((result)=>{
//   console.log(result ?result.length: result ,'  number of migrations are executed');
// })
// .catch((err) => {
//   console.log('err -> ', err);
// });
//migrations-start


app.use('/api/v1/*', (req, res, next) => {
  const url = req.originalUrl;
  if(url.includes("/api/v1/auth")){
    console.log('excempted auth route')
    next();
  }
  else{
    if(!req.session || !req.session.email){
      // res.status(401)
      // res.json({error: 'session not found'})
      next()
    }
    else{
      next();
    }
  }
})

app.use('/api/v1', indexrouter);

if(isProduction){
  // app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => {
    res.send('any route')  
    // res.sendFile(HTML_FILE);
  });
} else {
  app.get('*', (req, res) => {
    res.status(404).send(`Api not exist for ${req.url}`);
  });
}

app.listen(port, async function () {
  db.query('SELECT datname FROM pg_database', [], (err, result) => {
    if (err) {
      console.log('err -> ', err);
    }
    console.log('result -> ', result);
  })
  console.log('App listening on port: ' + port);

});
     
// PORT=3000
// ENVIRONMENT=DEVELOPMENT
// HOST=remotemysql.com
// DBUSER=Vosw60U6dC
// PASSWORD=iJKvkpVgVt
// DATABASE=Vosw60U6dC
// GOOGLECLIENTAPI=19930369842-1onpt44bcn1tgsp6obegvii2a17enckv.apps.googleusercontent.com


// interceptor
// api-intergation
// server
// production-build -----
// deploy
// githubb actions
// nano-msg
// protobuf
