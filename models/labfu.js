'use strict';

let Q = require('q');

module.exports = {
  getLabHistory(db, hpid, labcode) {
    let q = Q.defer();
    db('labfu as l')
      .select('l.DATE_SERV', 'l.LABRESULT', 'l.HOSPCODE', 'l.PID')
      .where('l.LABTEST', labcode)
      .whereNotNull('l.LABRESULT')
      .where('l.LABRESULT', '>', 0)
      .whereIn(db.raw('concat(l.HOSPCODE, l.PID)'), hpid)
      .orderBy('l.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  },

  getService(db, hpid) {
    let q = Q.defer();
    /*
     select l.HOSPCODE, h.hospname as HOSPNAME, l.DATE_SERV
     from labfu as l
     left join chospcode as h on h.hospcode=l.HOSPCODE
     group by l.HOSPCODE, l.DATE_SERV
     limit 10
     */
    db('labfu as l')
      .select('l.HOSPCODE', 'h.hospname as HOSPNAME', 'l.DATE_SERV', 'l.PID', 'l.SEQ')
      .leftJoin('chospcode as h', 'h.hospcode', 'l.HOSPCODE')
      .whereIn(db.raw('concat(l.HOSPCODE, l.PID)'), hpid)
      .groupByRaw('l.HOSPCODE, l.DATE_SERV')
      .orderBy('l.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  },
  
  getLabTest(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      select l.LABRESULT, ct.labtest as LABTEST_NAME
      from labfu as l
      left join clabtest as ct on l.LABTEST=ct.id_labtest
      where l.HOSPCODE=? and l.PID=? and l.SEQ=?`
      ;
    
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  },

  getCreatinine(db, hpid) {
    let q = Q.defer();

    let sql = `
      select l.LABRESULT, p.SEX, l.DATE_SERV
      from labfu as l
      inner join person as p on p.PID=l.PID and p.HOSPCODE=l.HOSPCODE
      where l.LABTEST="11"
      and l.LABRESULT>0
      and l.PID=? 
      and l.HOSPCODE=?
      order by l.DATE_SERV DESC
      limit 10
    `;

    db('labfu as l')
      .select('l.LABRESULT', 'l.DATE_SERV')
      // .join(db.raw('person as p on p.PID=l.PID and p.HOSPCODE=l.HOSPCODE'))
      .whereIn(db.raw('concat(l.HOSPCODE, l.PID)'), hpid)
      .where('l.LABTEST', '11')
      .where('l.LABRESULT', '>', 0)
      .groupBy('l.DATE_SERV')
      .orderBy('l.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise
  }
};