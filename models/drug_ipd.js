'use strict';

let Q = require('q');

module.exports = {

  getDrug(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      select dri.DNAME, dri.AMOUNT, cu.unit as UNIT_NAME,
      dri.DATESTART, dri.DATEFINISH
      from drug_ipd as dri
      left join cunit as cu on cu.id_unit=dri.UNIT
      where dri.HOSPCODE=? and dri.PID=? and dri.AN=?
      order by dri.DATESTART DESC
      
    `;
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
