'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  const sql = `CREATE TABLE synonyms( 
    id varchar(255) PRIMARY KEY,
    meaning_id varchar(255),
    definition_id varchar(255),
    synonym varchar(255)
  )`
  db.runSql(sql, (err) => {
    if(err){
      console.log(err)
      return console.log(err);
    }
    callback()
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
