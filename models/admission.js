'use strict';

let Q = require('q');

module.exports = {

  getAdmission(db, hpid) {
    let q = Q.defer();
    db('admission as  a')
      .select('a.HOSPCODE', 'a.PID', 'a.SEQ', 'a.AN', 'a.DATETIME_ADMIT', 'a.DATETIME_DISCH', 'a.DISCHSTATUS', 
        'a.DISCHTYPE', 'h.hospname as HOSPNAME', 'ct.disctype as DISCHTYPE_NAME', 'cs.dischstatus as DISCHTATUS_NAME',
        't.instype_name as INSTYPE_NAME')
      .leftJoin('chospcode as h', 'h.hospcode', 'a.HOSPCODE')
      .leftJoin('cinstype as t', 't.id_instype', 'a.INSTYPE')
      .leftJoin('cdisctype as ct', 'ct.id_disctype', 'a.DISCHTYPE')
      .leftJoin('cdischstatus as cs', 'cs.id_dischstatus', 'a.DISCHSTATUS')
      .whereIn(db.raw('concat(a.HOSPCODE, a.PID)'), hpid)
      .orderBy('a.DATETIME_ADMIT', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  }
};
