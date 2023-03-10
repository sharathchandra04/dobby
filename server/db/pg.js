import { Pool } from 'pg';
console.log(process.env.ENVIRONMENT);
const isProduction1 = process.env.ENVIRONMENT != 'DEVELOPMENT'

let pool;
if(!isProduction1){
  pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    database: 'logiq',
    max: 20,
    password: 'postgres',
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
} else {
  pool = new Pool({
    host: 'database-1.cxkrzizer1o4.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    // database: 'postgres',
    max: 20,
    password: 'postgres',
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 1000*60*2,
  })

}
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};
// module.exports = {
//   query: (text, params, callback) => {
//     return awspool.query(text, params, callback)
//   },
// };