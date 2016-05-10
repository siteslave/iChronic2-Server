"use strict";

let Q = require('q');

module.exports = {
  getPatient(db, hospcode) {
    let q = Q.defer();
  },
  
  getLabFu(db, hpid, labcode) {
    let q = $q.defer();
    let sql = `
      select l.DATE_SERV, l.LABRESULT, l.D_UPDATE 
      from labfu as l
      where l.LABTEST=?
      and (l.LABRESULT is not null and l.LABRESULT>0)
      and concat(l.HOSPCODE, l.PID) in 
      order by l.DATE_SERV desc
      limit 10
    `;

    db('labfu as l')
      .select('l.DATE_SERV', 'l.LABRESULT', 'l.D_UPDATE')
      .where('l.LABTEST', labcode)
      .whereNotNull('l.LABRESULT')
      .where('l.LABRESULT', '>', 0)
      .whereIn(db.raw('concat(l.HOSPCODE, l.PID)'), hpid)
      .orderBy('l.DATE_SERV', 'DESC')
      .then(rows => q.resolve(rows))
      .catch(err => q.reject(err));
      
    return q.promise;
  }
};