'use strict';

let Q = require('q');

module.exports = {
  getHpid(db, cid) {
    let q = Q.defer();
    
    /*
     select concat(HOSPCODE, PID) as hpid
     from person 
     where CID="1330500208358"
     */
    
    db('person')
      .select(db.raw('concat(HOSPCODE, PID) as hpid'))
      .where('CID', cid)
      .then(rows => q.resolve(rows))
      .catch(err => q.reject(err));
    
    return q.promise;
  }
};