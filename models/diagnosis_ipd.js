'use strict';

let Q = require('q');

module.exports = {

  getDiag(db, hospcode, pid, an) {
    let q = Q.defer();
    
    let sql = `
      select dx.DIAGCODE, icd.diagtname as DIAGNAME, cd.diagtypedesc as DIAGTYPE_NAME
      from diagnosis_ipd as dx
      left join cicd10tm as icd on icd.diagcode=dx.DIAGCODE
      left join cdiagtype as cd on cd.diagtype=dx.DIAGTYPE
      where dx.HOSPCODE=? and dx.PID=? and dx.AN=?
      order by dx.DIAGTYPE
    `;
    db.raw(sql, [hospcode, pid, an])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
