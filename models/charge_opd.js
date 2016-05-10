'use strict';

let Q = require('q');

module.exports = {

  getCharge(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      select ch.QUANTITY, ch.PRICE, ci.chargeitem as CHARGEITME_NAME,
      cins.instype_name as INSTYPE_NAME
      from charge_opd as ch
      left join cchargeitem as ci on ci.id_chargeitem=ch.CHARGEITEM
      left join cinstype as cins on cins.id_instype=ch.INSTYPE
      where ch.HOSPCODE=? and ch.PID=? and ch.SEQ=?
      
    `;
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
