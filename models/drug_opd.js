'use strict';

let Q = require('q');

module.exports = {

  getDrug(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      select dro.DNAME, dro.AMOUNT, cu.unit as UNIT_NAME
      from drug_opd as dro
      left join cunit as cu on cu.id_unit=dro.UNIT
      where dro.HOSPCODE=? and dro.PID=? and dro.SEQ=?
      order by dro.DNAME
      
    `;
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
