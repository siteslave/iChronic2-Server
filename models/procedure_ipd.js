'use strict';

let Q = require('q');

module.exports = {

  getProcedure(db, hospcode, pid, an) {
    let q = Q.defer();
    
    let sql = `
      select pi.PROCEDCODE, cp.th_desc as PROCEDNAME,
      pi.TIMESTART, pi.TIMEFINISH
      from procedure_ipd as pi
      left join cproced as cp on cp.procedcode=pi.PROCEDCODE
      where pi.HOSPCODE=? and pi.PID=? and pi.AN=?
    `;
    //       
    db.raw(sql, [hospcode, pid, an])
      .then(rows => {
        q.resolve(rows[0]);
      }, err => q.reject(err));

    return q.promise;
  }
  
};
