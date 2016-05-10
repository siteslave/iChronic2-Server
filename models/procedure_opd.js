'use strict';

let Q = require('q');

module.exports = {

  getProcedure(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      select po.PROCEDCODE, po.SERVICEPRICE, cp.th_desc as PROCEDNAME
      from procedure_opd as po
      left join cproced as cp on cp.procedcode=po.PROCEDCODE
      where po.HOSPCODE=? and po.PID=? and po.SEQ=?
    `;
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
