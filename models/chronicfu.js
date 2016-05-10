'use strict';

let Q = require('q');

module.exports = {

  getFu(db, hpid) {
    let q = Q.defer();
    
    db('chronicfu as c')
      .select('c.HOSPCODE', 'c.PID', 'c.DATE_SERV', 'c.WEIGHT', 'c.HEIGHT', 
        'c.WAIST_CM', 'c.SBP', 'c.DBP', 'c.FOOT', 'c.RETINA', 'h.hospname as HOSPNAME',
        'cr.retina as RETINA_NAME', 'cf.foot as FOOT_NAME')
      .leftJoin('chospcode as h', 'h.hospcode', 'c.HOSPCODE')
      .leftJoin('cretina as cr', 'cr.id_retina', 'c.RETINA')
      .leftJoin('cfoot as cf', 'cf.id_foot', 'c.FOOT')
      // .where('c.SBP', '>', 0)
      // .where('c.DBP', '>', 0)
      .whereIn(db.raw('concat(c.HOSPCODE, c.PID)'), hpid)
      .orderBy('c.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  }
};
