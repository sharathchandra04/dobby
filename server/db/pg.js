import { Pool } from 'pg';
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'logiq',
  max: 20,
  password: 'postgres',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
};
// const awspool = new Pool({
//   host: 'database-1-instance-1.cajfrh878rvs.us-west-2.rds.amazonaws.com',
//   user: 'postgres',
//   // database: 'postgres',
//   max: 20,
//   password: 'postgres',
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 1000*60*2,
// })
// module.exports = {
//   query: (text, params, callback) => {
//     return awspool.query(text, params, callback)
//   },
// };