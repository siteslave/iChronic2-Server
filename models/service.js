'use strict';

let Q = require('q');

module.exports = {

  getServices(db, hpid) {
    let q = Q.defer();
    /*
     select s.PID, s.HOSPCODE, h.hospname, s.SEQ, s.DATE_SERV, s.TIME_SERV, s.INSTYPE, t.instype_name
     from service as s
     left join chospcode as h on h.hospcode=s.HOSPCODE
     left join cinstype as t on t.id_instype=s.INSTYPE
     limit 10
     */
    db('service as s')
      .select('s.PID', 's.HOSPCODE', 'h.hospname as HOSPNAME', 's.SEQ', 's.DATE_SERV', 's.TIME_SERV', 's.INSTYPE', 't.instype_name as INSTYPE_NAME')
      .leftJoin('chospcode as h', 'h.hospcode', 's.HOSPCODE')
      .leftJoin('cinstype as t', 't.id_instype', 's.INSTYPE')
      .whereIn(db.raw('concat(s.HOSPCODE, s.PID)'), hpid)
      .orderBy('s.DATE_SERV', 'DESC')
      .limit(10)
      .then(rows => q.resolve(rows), err => q.reject(err));

    return q.promise;
  },
  
  getServiceInfo(db, hospcode, pid, seq) {
    let q = Q.defer();
    
    let sql = `
      SELECT p.NAME, p.LNAME, p.SEX, p.BIRTH, timestampdiff(year, p.BIRTH, current_date()) as AGE, s.HOSPCODE, s.PID, s.HN, s.SEQ, s.DATE_SERV,
      s.TIME_SERV, s.INSID, s.MAIN, s.REFERINHOSP,
      s.CHIEFCOMP, s.BTEMP, s.SBP, s.DBP, s.PR, s.RR, s.REFEROUTHOSP,
      ci.intime as INTIME_NAME, cins.instype_name as INSTYPE_NAME, ct.typein as TYPEIN_NAME,
      ch1.hospname as REFERINHOSP_NAME, ch2.hospname as REFEROUTHOSP_NAME, ch3.hospname as INS_MAIN_HOSPNAME,
      ch4.hospname as SERVICE_HOSPNAME
      FROM service as s
      inner join person as p on p.HOSPCODE=s.HOSPCODE and p.PID=s.PID
      left join cintime as ci on ci.id_intime=s.INTIME
      left join cinstype as cins on cins.id_instype=s.INSTYPE
      left join ctypein as ct on ct.id_typein=s.TYPEIN
      left join chospcode as ch1 on ch1.hospcode=s.REFERINHOSP
      left join chospcode as ch2 on ch2.hospcode=s.REFEROUTHOSP
      left join chospcode as ch3 on ch3.hospcode=s.MAIN
      left join chospcode as ch4 on ch4.hospcode=s.HOSPCODE
      
      where s.HOSPCODE=? and s.PID=? and s.SEQ=?
    `;
    db.raw(sql, [hospcode, pid, seq])
      .then(rows => q.resolve(rows[0]), err => q.reject(err));

    return q.promise;
  }
  
};
