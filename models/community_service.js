'use strict';

let Q = require('q');

module.exports = {

  getService(db, hpid) {
    let q = Q.defer();
    /*
     select c.HOSPCODE, c.PID, c.SEQ, c.DATE_SERV, h.hospname as HOSPNAME,
     cs.comservice as COMSERVICE_NAME, p.CID
     from community_service as c
     inner join person as p on p.HOSPCODE=c.HOSPCODE and p.PID=c.PID
     inner join ccomservice as cs on cs.id_comservice=c.COMSERVICE
     left join chospcode as h on h.hospcode=c.HOSPCODE
     -- order by c.DATE_SERV desc
     limit 10
     */
    db('community_service as c')
      .select('c.HOSPCODE', 'c.PID', 'c.SEQ', 'c.DATE_SERV', 'h.hospname as HOSPNAME',
        'cs.comservice as COMSERVICE_NAME')
      .leftJoin('chospcode as h', 'h.hospcode', 'c.HOSPCODE')
      .innerJoin('ccomservice as cs', 'cs.id_comservice', 'c.COMSERVICE')
      .whereIn(db.raw('concat(c.HOSPCODE, c.PID)'), hpid)
      .orderBy('c.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  }
};
