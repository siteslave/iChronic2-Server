'use strict';

let Q = require('q');

module.exports = {

  getAllergy(db, hpid) {
    let q = Q.defer();
    let sql = db('drugallergy as d')
      .select('d.HOSPCODE', 'd.DNAME', 'd.DRUGALLERGY', 'd.D_UPDATE', 'd.DATERECORD', 'cd.typedx as TYPEDX',
      'cl.alevel AS LEVELNAME', 'ch.hospname as REPORT_HOSPNAME', 'd.HOSPCODE as REPORT_HOSPCODE',
      'ch1.hospname as INFORM_HOSPNAME', 'd.INFORMHOSP as INFORM_HOSPCODE')
      .whereIn(db.raw('concat(d.HOSPCODE, d.PID)'), hpid)
      .leftJoin('ctypedx as cd', 'cd.id_typedx', 'd.TYPEDX')
      .leftJoin('calevel as cl', 'cl.id_alevel', 'd.ALEVEL')
      .leftJoin('chospcode as ch', 'ch.hospcode', 'd.HOSPCODE')
      .leftJoin('chospcode as ch1', 'ch1.hospcode', 'd.INFORMHOSP')
      .groupByRaw('d.DNAME, d.ALEVEL, d.TYPEDX')
      .orderBy('d.DATERECORD', 'DESC')
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  }

};
